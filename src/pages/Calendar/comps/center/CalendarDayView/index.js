import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import AddPauseModal from '../../../../../components/AddPauseModal';
import { clinicActiveDoctorsSelector } from '../../../../../redux/selectors/clinicSelector';
import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from '../../../../../redux/selectors/scheduleSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import DoctorColumn from './DoctorColumn';
import DoctorItem from './DoctorItem';

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
  isLoading: true,
  isFetching: false,
  createIndicator: { visible: false, top: 0, doctorId: -1 },
  parentTop: 0,
  schedules: new Map(),
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
      return { ...state, schedules: action.payload };
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
        schedules,
        hours: dayHours,
        hoursContainers: updateHours,
      };
    }
    default:
      return state;
  }
};

const CalendarDayView = ({ viewDate, onScheduleSelect, onCreateSchedule }) => {
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const schedulesRef = useRef(null);
  const dataRef = useRef(null);
  const [
    { isLoading, hours, parentTop, schedules, pauseModal, hoursContainers },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (viewDate != null) {
      debounceFetching(false);
    }
  }, [viewDate, doctors]);

  useEffect(() => {
    handleScheduleUpdate();
  }, [updateSchedule]);

  useEffect(() => {
    if (deleteSchedule == null) {
      return;
    }
    const newSchedulesMap = new Map();
    for (const [doctorId, items] of schedules.entries()) {
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

  const handleScheduleUpdate = async () => {
    if (updateSchedule == null) {
      return;
    }
    const scheduleDate = moment(updateSchedule.startTime);
    const newSchedulesMap = new Map();
    if (newSchedulesMap.size === 0) {
      newSchedulesMap.set(updateSchedule.doctorId, [updateSchedule]);
      await fetchDayHours(scheduleDate.toDate());
      localDispatch(actions.setSchedules(newSchedulesMap));
      return;
    }

    for (const [doctorId, items] of schedules.entries()) {
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
          await fetchDayHours(scheduleDate.toDate());
        }
      }
      newSchedulesMap.set(doctorId, newSchedules);
    }
    localDispatch(actions.setSchedules(newSchedulesMap));
  };

  const fetchDayHours = async (date) => {
    const response = await dataAPI.fetchDaySchedulesHours(date);
    if (!response.isError) {
      localDispatch(actions.setHours(response.data));
    }
  };

  /**
   * Fetch a list of schedules for specified {@link viewDate}
   * @param {boolean} silent - either show or not loading indicator
   */
  const fetchDaySchedules = async (silent = false) => {
    if (!silent) {
      localDispatch(actions.setIsLoading(true));
    }
    const response = await dataAPI.fetchDaySchedules(viewDate);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { schedules, dayHours } = response.data;
      const schedulesMap = new Map();
      for (let item of schedules) {
        schedulesMap.set(item.doctorId, item.schedules);
      }
      localDispatch(
        actions.setSchedulesData({ schedules: schedulesMap, dayHours }),
      );
    }
    localDispatch(actions.setIsLoading(false));
  };

  const debounceFetching = useCallback(debounce(fetchDaySchedules, 100), [
    viewDate,
  ]);

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
      schedulesWithOffset.set(key, addOffsetToSchedules(value));
    });
    return schedulesWithOffset;
  };

  const schedulesWithOffset = useMemo(() => updateSchedules(schedules), [
    schedules,
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
    <Box className='calendar-day-view' id='calendar-day-view'>
      <AddPauseModal {...pauseModal} onClose={handleClosePauseModal} />
      {hours.length !== 0 && (
        <div className='day-doctors-container'>
          {doctors.map((doctor) => (
            <DoctorItem
              doctor={doctor}
              key={doctor.id}
              onAddPause={handleCreatePause}
            />
          ))}
        </div>
      )}
      <div className='day-data-container' ref={dataRef}>
        {isLoading && (
          <div className='loading-progress-wrapper'>
            <CircularProgress
              classes={{ root: 'loading-schedules-progress' }}
            />
          </div>
        )}
        {!isLoading && hours.length === 0 && (
          <div className='no-data-wrapper'>
            <img
              className='no-data-image'
              src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/rsz_4584.png'
              alt='No schedules'
            />
            <Typography classes={{ root: 'no-data-label' }}>
              {textForKey('No schedules for this day')}.
            </Typography>
          </div>
        )}
        <div className='day-hours-container' id='day-hours-container'>
          {halfHours.map((hour) => (
            <Typography
              id={hour}
              classes={{ root: 'day-hour-item' }}
              key={hour}
            >
              {hour}
            </Typography>
          ))}
        </div>
        <div
          ref={schedulesRef}
          className='day-schedules-container'
          id='day-schedules-container'
        >
          {doctors?.map((doctor, index) => (
            <DoctorColumn
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
    </Box>
  );
};

export default React.memo(CalendarDayView, (prevProps, nextProps) => {
  return isEqual(prevProps.viewDate, nextProps.viewDate);
});

CalendarDayView.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
  onScheduleSelect: PropTypes.func,
  onCreateSchedule: PropTypes.func,
};

CalendarDayView.defaultProps = {
  onCreateSchedule: () => null,
  onScheduleSelect: () => null,
  viewDate: new Date(),
};
