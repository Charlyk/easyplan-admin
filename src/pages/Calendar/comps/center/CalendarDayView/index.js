import React, { useEffect, useReducer, useRef } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import clsx from 'clsx';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { timer } from 'rxjs';

import NoSchedulesImg from '../../../../../assets/images/no_schedules.png';
import AddPauseModal from '../../../../../components/AddPauseModal';
import { clinicActiveDoctorsSelector } from '../../../../../redux/selectors/clinicSelector';
import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import DayViewSchedule from './DayViewSchedule';
import DoctorItem from './DoctorItem';
import ScheduleItemContainer from './ScheduleItemContainer';

const moment = extendMoment(Moment);

const initialState = {
  hours: [],
  isLoading: true,
  createIndicator: { visible: false, top: 0, doctorId: -1 },
  parentTop: 0,
  schedules: [],
  hasSchedules: false,
  pauseModal: {
    open: false,
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
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setHours:
      return { ...state, hours: action.payload };
    case reducerTypes.setParentTop:
      return { ...state, parentTop: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
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
    default:
      return state;
  }
};

const CalendarDayView = ({ viewDate, onScheduleSelect, onCreateSchedule }) => {
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const schedulesRef = useRef(null);
  const dataRef = useRef(null);
  const [
    { isLoading, hours, parentTop, schedules, pauseModal },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (dataRef.current != null) {
      dataRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    localDispatch(actions.setSchedules([]));
    fetchDaySchedules();
  }, [viewDate, doctors, updateAppointments]);

  useEffect(() => {
    if (schedulesRef.current != null) {
      const schedulesRect = schedulesRef.current.getBoundingClientRect();
      localDispatch(actions.setParentTop(schedulesRect.top));
    }
  }, [schedulesRef.current]);

  const fetchDaySchedules = async () => {
    const response = await dataAPI.fetchDaySchedules(viewDate);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { schedules, dayHours } = response.data;
      localDispatch(actions.setHours(dayHours));
      const mappedSchedules = [];
      // map schedules by adding an offset for schedules that intersect other schedules
      for (let item of doctors) {
        const doctorSchedules =
          schedules.find(it => it.doctorId === item.id)?.schedules || [];
        const newSchedules = [];
        // check if schedules intersect other schedules and update their offset
        for (let schedule of doctorSchedules) {
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
          await timer(500);
        }
        mappedSchedules.push({
          doctor: item,
          schedules: newSchedules,
        });
      }
      localDispatch(actions.setSchedules(mappedSchedules));
    }
    localDispatch(actions.setIsLoading(false));
  };

  const getLinePositionForHour = hour => {
    const parentElement = document.getElementById('day-hours-container');
    const parentRect = parentElement.getBoundingClientRect();
    const element = document.getElementById(hour);
    const elementRect = element?.getBoundingClientRect() || {
      top: 0,
      height: 30,
    };
    return Math.abs(
      elementRect.height / 2 + (elementRect.top - parentRect.top),
    );
  };

  const getHoursHeight = () => {
    const element = document.getElementById('day-hours-container');
    const rect = element?.getBoundingClientRect() || { height: 0 };
    return rect.height;
  };

  const handleOpenPauseModal = (doctor, startTime, endTime, id, comment) => {
    localDispatch(
      actions.setPauseModal({
        open: true,
        doctor,
        startTime,
        endTime,
        id,
        comment,
      }),
    );
  };

  const handleClosePauseModal = () => {
    localDispatch(actions.setPauseModal(initialState.pauseModal));
  };

  const handleAddSchedule = doctor => (startHour, endHour) => {
    onCreateSchedule(doctor, startHour, endHour);
  };

  const handleScheduleClick = schedule => {
    if (schedule.type === 'Schedule') {
      onScheduleSelect(schedule);
    } else {
      const doctor = doctors.find(item => item.id === schedule.doctorId);
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

  const getScheduleItemsContainer = () => {
    return hours.map((hour, index) => {
      if (index === 0) {
        return { start: null, end: hour };
      } else {
        return { start: hours[index - 1], end: hour };
      }
    });
  };

  const handleCreatePause = (
    doctor,
    startHour = null,
    endHour = null,
    id = null,
    comment = null,
  ) => {
    handleOpenPauseModal(doctor, startHour, endHour, id, comment);
  };

  const getSchedulesForDoctor = doctorId => {
    const scheduleData = schedules.find(item => item.doctor.id === doctorId);
    return scheduleData?.schedules || [];
  };

  const halfHours = hours.filter(
    item => item.split(':')[1] === '00' || item.split(':')[1] === '30',
  );

  return (
    <Box className='calendar-day-view' id='calendar-day-view'>
      <AddPauseModal {...pauseModal} onClose={handleClosePauseModal} />
      {hours.length !== 0 && (
        <div className='day-doctors-container'>
          {doctors.map(doctor => (
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
              src={NoSchedulesImg}
              alt='No schedules'
            />
            <Typography classes={{ root: 'no-data-label' }}>
              {textForKey('No schedules for this day')}.
            </Typography>
          </div>
        )}
        <div className='day-hours-container' id='day-hours-container'>
          {halfHours.map(hour => (
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
          {halfHours.map(hour => (
            <div
              id={`${hour}-line`}
              className='hour-line'
              style={{ top: getLinePositionForHour(hour) }}
              key={`${hour}-line`}
            />
          ))}
          {doctors.map(doctor => {
            const doctorRect = document
              .getElementById(doctor.id)
              ?.getBoundingClientRect() || {
              width: 0,
            };
            return (
              <div
                id={`${doctor.id}&column`}
                key={`${doctor.id}-column`}
                style={{ width: doctorRect.width, height: getHoursHeight() }}
                className={clsx(
                  'day-schedules-column',
                  doctor.isInVacation && 'disabled',
                )}
              >
                {getSchedulesForDoctor(doctor.id).map((schedule, index) => (
                  <DayViewSchedule
                    key={schedule.id}
                    parentTop={parentTop}
                    schedule={schedule}
                    index={index}
                    viewDate={viewDate}
                    onScheduleSelect={handleScheduleClick}
                    offset={0}
                    firstHour={hours[0]}
                  />
                ))}
                {getScheduleItemsContainer().map(hour => {
                  return (
                    <ScheduleItemContainer
                      disabled={doctor.isInVacation}
                      onAddSchedule={handleAddSchedule(doctor)}
                      startHour={hour.start}
                      endHour={hour.end}
                      key={`${hour.start}-schedule-item`}
                      className='day-schedule-item-container'
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Box>
  );
};

export default CalendarDayView;

CalendarDayView.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
  onScheduleSelect: PropTypes.func,
  onCreateSchedule: PropTypes.func,
};

CalendarDayView.defaultProps = {
  onCreateSchedule: () => null,
  onScheduleSelect: () => null,
};
