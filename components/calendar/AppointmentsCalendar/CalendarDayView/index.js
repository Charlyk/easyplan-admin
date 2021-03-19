import React, {
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { CircularProgress, Typography } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import AddPauseModal from '../../AddPauseModal';
import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from '../../../../redux/selectors/scheduleSelector';
import { generateReducerActions } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import DoctorColumn from './DoctorColumn';
import DoctorItem from './DoctorItem';
import styles from '../../../../styles/CalendarDayView.module.scss';
import { toast } from "react-toastify";
import axios from "axios";
import { baseAppUrl } from "../../../../eas.config";

const moment = extendMoment(Moment);

const createContainerHours = (hours) => {
  const updateHours = [];
  for (let hour of hours) {
    const hourParts = hour.split(':');
    const [hours, minutes] = hourParts;
    updateHours.push(hour);
    if (minutes === '00') {
      updateHours.push(`${hours}:15`);
    } else if (minutes === '30') {
      updateHours.push(`${hours}:45`);
    }
  }
  return updateHours;
};

const initialState = {
  hours: [],
  hoursContainers: [],
  isLoading: false,
  isFetching: false,
  createIndicator: { visible: false, top: 0, doctorId: -1 },
  parentTop: 0,
  schedulesMap: new Map(),
  hasSchedules: false,
  pauseModal: {
    open: false,
    viewDate: Date(),
    doctor: null,
    startTime: null,
    endTime: null,
    id: null,
    comment: '',
  },
};

const reducerTypes = {
  setHours: 'setHours',
  setIsLoading: 'setIsLoading',
  setCreateIndicator: 'setCreateIndicator',
  setCreateIndicatorPosition: 'setCreateIndicatorPosition',
  setParentTop: 'setParentTop',
  setSchedules: 'setSchedules',
  setPauseModal: 'setPauseModal',
  setHoursContainers: 'setHoursContainers',
  setSchedulesData: 'setSchedulesData',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setHours: {
      const updateHours = createContainerHours(action.payload);
      return { ...state, hours: action.payload, hoursContainers: updateHours };
    }
    case reducerTypes.setParentTop:
      return { ...state, parentTop: action.payload };
    case reducerTypes.setIsLoading:
      return {
        ...state,
        isLoading: action.payload,
        isFetching: action.payload,
      };
    case reducerTypes.setCreateIndicator: {
      return { ...state, createIndicator: action.payload };
    }
    case reducerTypes.setSchedules:
      return { ...state, schedulesMap: action.payload };
    case reducerTypes.setCreateIndicatorPosition:
      return {
        ...state,
        createIndicator: { ...state.createIndicator, top: action.payload },
      };
    case reducerTypes.setPauseModal:
      return { ...state, pauseModal: action.payload };
    case reducerTypes.setHoursContainers:
      return { ...state, hoursContainers: action.payload };
    case reducerTypes.setSchedulesData: {
      const { schedules, dayHours } = action.payload;
      const updateHours = createContainerHours(dayHours);
      return {
        ...state,
        schedulesMap: schedules,
        hours: dayHours,
        hoursContainers: updateHours,
      };
    }
    default:
      return state;
  }
};

const CalendarDayView = ({ schedules, doctors, viewDate, dayHours, onScheduleSelect, onCreateSchedule }) => {
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const schedulesRef = useRef(null);
  const dataRef = useRef(null);
  const [
    { isLoading, parentTop, hours, pauseModal, hoursContainers, schedulesMap },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    handleScheduleUpdate();
  }, [updateSchedule]);

  useEffect(() => {
    if (deleteSchedule == null) {
      return;
    }
    const newSchedulesMap = new Map();
    for (const [doctorId, items] of schedulesMap.entries()) {
      if (deleteSchedule.doctorId !== doctorId) {
        newSchedulesMap.set(doctorId, items);
        // don't have to do anything to this doctor schedules
        continue;
      }
      const newSchedules = cloneDeep(items);
      remove(newSchedules, (item) => item.id === deleteSchedule.id);
      newSchedulesMap.set(doctorId, newSchedules);
    }
    localDispatch(actions.setSchedules(newSchedulesMap));
  }, [deleteSchedule]);

  useEffect(() => {
    if (schedulesRef.current != null) {
      const schedulesRect = schedulesRef.current.getBoundingClientRect();
      localDispatch(actions.setParentTop(schedulesRect.top));
    }
  }, [schedulesRef.current]);

  useEffect(() => {
    const updatedSchedules = new Map();
    schedules.forEach(item => {
      updatedSchedules.set(item.doctorId, item.schedules);
    });
    localDispatch(actions.setSchedules(updatedSchedules));
  }, [schedules]);

  useEffect(() => {
    localDispatch(actions.setHours(dayHours));
  }, [dayHours]);

  const isOutOfBounds = (schedule) => {
    if (hours.length === 0) {
      return true;
    }
    const scheduleTime = moment(schedule.endTime);
    const lastHour = hours[hours.length - 1];
    const [hour, minute] = lastHour.split(':');
    const maxTime = moment(viewDate)
      .set('hour', parseInt(hour))
      .set('minute', parseInt(minute));
    return scheduleTime.isAfter(maxTime);
  }

  const handleScheduleUpdate = async () => {
    if (updateSchedule == null) {
      return;
    }
    const scheduleDate = moment(updateSchedule.startTime);
    const newSchedulesMap = new Map();

    if (isOutOfBounds(updateSchedule)) {
      await fetchDayHours(scheduleDate.toDate());
    }

    if (schedulesMap.size === 0) {
      newSchedulesMap.set(updateSchedule.doctorId, [updateSchedule]);
      localDispatch(actions.setSchedules(newSchedulesMap));
      return;
    }

    for (const [doctorId, items] of schedulesMap.entries()) {
      if (updateSchedule.doctorId !== doctorId) {
        newSchedulesMap.set(doctorId, items);
        // don't have to do anything to this doctor schedules
        continue;
      }
      // check if schedule exists
      const scheduleExists = items.some(
        (item) => item.id === updateSchedule.id,
      );
      const newSchedules = scheduleExists
        ? items.map((item) => {
            if (item.id !== updateSchedule.id) {
              return item;
            }
            return updateSchedule;
          })
        : cloneDeep(items);
      if (!scheduleExists) {
        const currentDate = moment(viewDate);
        if (scheduleDate.isSame(currentDate, 'days')) {
          // schedule does not exist so we need to add it to the list
          newSchedules.push(updateSchedule);
        }
      }
      newSchedulesMap.set(doctorId, newSchedules);
    }
    localDispatch(actions.setSchedules(newSchedulesMap));
  };

  const fetchDayHours = async (date) => {
    try {
      const query = { date: moment(date).format('YYYY-MM-DD') };
      const queryString = new URLSearchParams(query).toString()
      const response = await axios.get(`${baseAppUrl}/api/schedules/day-hours?${queryString}`);
      localDispatch(actions.setHours(response.data));
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * setup an offset with schedules that intersect each other time
   * @param {Array.<Object>} schedules
   * @return {Array.<Object>}
   */
  const addOffsetToSchedules = (schedules) => {
    const newSchedules = [];
    // check if schedules intersect other schedules and update their offset
    for (let schedule of schedules) {
      const scheduleRange = moment.range(
        moment(schedule.startTime),
        moment(schedule.endTime),
      );
      if (schedule.offset == null) {
        schedule.offset = 0;
      }
      // update new schedule offset based on already added schedules
      for (let item of newSchedules) {
        const itemRange = moment.range(
          moment(item.startTime),
          moment(item.endTime),
        );
        const hasIntersection = scheduleRange.intersect(itemRange) != null;
        if (hasIntersection) {
          schedule.offset = (item.offset || 0) + 1;
        }
      }
      // add the new schedules to array to check the next one against it
      newSchedules.push(schedule);
    }
    return newSchedules;
  };

  /**
   * Update schedules by adding an offset
   * @param {Map.<number, [Object]>} schedules
   * @return {Map<number, [Object]>}
   */
  const updateSchedules = (schedules) => {
    // map schedules by adding an offset for schedules that intersect other schedules
    if (schedules == null) {
      return new Map();
    }
    const schedulesWithOffset = new Map();
    schedules.forEach((value, key) => {
      if (Array.isArray(value)) {
        schedulesWithOffset.set(key, addOffsetToSchedules(value));
      }
    });
    return schedulesWithOffset;
  };

  const schedulesWithOffset = useMemo(() => updateSchedules(schedulesMap), [
    schedulesMap,
    hours,
  ]);

  /**
   * Open pause details modal
   * @param {Object} doctor
   * @param {Date} startTime
   * @param {Date} endTime
   * @param {number} id
   * @param {string} comment
   */
  const handleOpenPauseModal = (doctor, startTime, endTime, id, comment) => {
    localDispatch(
      actions.setPauseModal({
        open: true,
        doctor,
        startTime,
        endTime,
        id,
        comment,
        viewDate: moment(viewDate),
      }),
    );
  };

  /**
   * Close pause details modal
   */
  const handleClosePauseModal = () => {
    localDispatch(actions.setPauseModal(initialState.pauseModal));
  };

  /**
   * Trigger add schedule callback
   * @param {Object} doctor
   * @return {function(*=, *=): void}
   */
  const handleAddSchedule = (doctor) => (startHour, endHour) => {
    onCreateSchedule(doctor, startHour, endHour);
  };

  /**
   * Handle user clicked on a schedule
   * @param {Object} schedule
   */
  const handleScheduleClick = (schedule) => {
    if (schedule.type === 'Schedule') {
      onScheduleSelect(schedule);
    } else {
      const doctor = doctors.find((item) => item.id === schedule.doctorId);
      if (doctor != null) {
        handleCreatePause(
          doctor,
          schedule.startTime,
          schedule.endTime,
          schedule.id,
          schedule.comment,
        );
      }
    }
  };

  /**
   * Create a pause record
   * @param {Object} doctor
   * @param {Date|null} startHour
   * @param {Date|null} endHour
   * @param {number|null} id
   * @param {string|null} comment
   */
  const handleCreatePause = (
    doctor,
    startHour = null,
    endHour = null,
    id = null,
    comment = null,
  ) => {
    handleOpenPauseModal(doctor, startHour, endHour, id, comment);
  };

  /**
   * Get a list of schedules for doctor with specified id
   * @param {number} doctorId
   * @return {[Object]|[]}
   */
  const getSchedulesForDoctor = (doctorId) => {
    return schedulesWithOffset.get(doctorId) || [];
  };

  const halfHours = hours.filter(
    (item) => item.split(':')[1] === '00' || item.split(':')[1] === '30',
  );

  return (
    <div className={styles['calendar-day-view']} id='calendar-day-view'>
      <AddPauseModal {...pauseModal} onClose={handleClosePauseModal} />
      {hours.length !== 0 && (
        <div className={styles['day-doctors-container']}>
          {doctors.map((doctor) => (
            <DoctorItem
              doctor={doctor}
              key={doctor.id}
              onAddPause={handleCreatePause}
            />
          ))}
        </div>
      )}
      <div className={styles['day-data-container']} ref={dataRef}>
        {isLoading && (
          <div className={styles['loading-progress-wrapper']}>
            <CircularProgress
              classes={{ root: 'circular-progress-bar' }}
            />
          </div>
        )}
        {!isLoading && hours.length === 0 && (
          <div className={styles['no-data-wrapper']}>
            <img
              className={styles['no-data-image']}
              src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/rsz_4584.png'
              alt='No schedules'
            />
            <Typography classes={{ root: styles['no-data-label'] }}>
              {textForKey('No schedules for this day')}.
            </Typography>
          </div>
        )}
        <div className={styles['day-hours-container']} id='day-hours-container'>
          {halfHours.map((hour) => (
            <Typography
              id={hour}
              classes={{ root: styles['day-hour-item'] }}
              key={hour}
            >
              {hour}
            </Typography>
          ))}
        </div>
        <div
          ref={schedulesRef}
          className={styles['day-schedules-container']}
          id='day-schedules-container'
        >
          {doctors?.map((doctor, index) => (
            <DoctorColumn
              doctorsCount={doctors?.length || 0}
              index={index}
              key={doctor.id}
              viewDate={viewDate}
              firstHour={hours[0]}
              schedules={getSchedulesForDoctor(doctor.id)}
              parentTop={parentTop}
              onAddSchedule={handleAddSchedule}
              doctor={doctor}
              hoursContainers={hoursContainers}
              onScheduleClick={handleScheduleClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;

CalendarDayView.propTypes = {
  schedules: PropTypes.any,
  dayHours: PropTypes.arrayOf(PropTypes.string),
  onScheduleSelect: PropTypes.func,
  onCreateSchedule: PropTypes.func,
};

CalendarDayView.defaultProps = {
  onCreateSchedule: () => null,
  onScheduleSelect: () => null,
  viewDate: new Date(),
};
