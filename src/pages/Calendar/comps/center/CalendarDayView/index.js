import React, { useEffect, useReducer, useRef } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { timer } from 'rxjs';

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
  isLoading: false,
  createIndicator: { visible: false, top: 0, doctorId: -1 },
  parentTop: 0,
  schedules: [],
};

const reducerTypes = {
  setHours: 'setHours',
  setIsLoading: 'setIsLoading',
  setCreateIndicator: 'setCreateIndicator',
  setCreateIndicatorPosition: 'setCreateIndicatorPosition',
  setParentTop: 'setParentTop',
  setSchedules: 'setSchedules',
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
    { isLoading, hours, parentTop, schedules },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (dataRef.current != null) {
      dataRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    localDispatch(actions.setSchedules([]));
    fetchWorkHours();
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
      const { data: schedules } = response;
      const mappedSchedules = [];
      for (let item of doctors) {
        const doctorSchedules =
          schedules.find(it => it.doctorId === item.id)?.schedules || [];
        const newSchedules = [];
        for (let schedule of doctorSchedules) {
          const scheduleRange = moment.range(
            moment(schedule.startTime),
            moment(schedule.endTime),
          );
          if (schedule.offset == null) {
            schedule.offset = 0;
          }
          schedule.offset += newSchedules.filter(item => {
            const itemRange = moment.range(
              moment(item.startTime),
              moment(item.endTime),
            );
            return itemRange.intersect(scheduleRange);
          }).length;
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

  const fetchWorkHours = async () => {
    localDispatch(actions.setIsLoading(true));
    const day = moment(viewDate).isoWeekday();
    const response = await dataAPI.fetchClinicWorkHoursV2(day);
    if (response.isError) {
      toast.error(textForKey(response.message));
      localDispatch(actions.setIsLoading(false));
    } else {
      localDispatch(actions.setHours(response.data));
      fetchDaySchedules();
    }
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

  const handleAddSchedule = doctor => (startHour, endHour) => {
    onCreateSchedule(doctor, startHour, endHour);
  };

  const handleScheduleClick = schedule => {
    onScheduleSelect(schedule);
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

  const getSchedulesForDoctor = doctorId => {
    const scheduleData = schedules.find(item => item.doctor.id === doctorId);
    return scheduleData?.schedules || [];
  };

  const halfHours = hours.filter(
    item => item.split(':')[1] === '00' || item.split(':')[1] === '30',
  );

  return (
    <Box className='calendar-day-view' id='calendar-day-view'>
      <div className='day-doctors-container'>
        {doctors.map(doctor => (
          <DoctorItem doctor={doctor} key={doctor.id} />
        ))}
      </div>
      <div className='day-data-container' ref={dataRef}>
        {isLoading && (
          <div className='loading-progress-wrapper'>
            <CircularProgress
              classes={{ root: 'loading-schedules-progress' }}
            />
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
                className='day-schedules-column'
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
