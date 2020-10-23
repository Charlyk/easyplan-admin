import React, { useEffect, useReducer, useRef } from 'react';

import { Tooltip, Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { animated } from 'react-spring';

import { toggleUpdateCalendarDoctorHeight } from '../../../../../redux/actions/actions';
import { setIsCalendarLoading } from '../../../../../redux/actions/calendar';
import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../../utils/helperFuncs';

const initialState = {
  appointments: [],
  previousHourWidth: -1,
};

const reducerTypes = {
  setAppointments: 'setAppointments',
  setPreviousHour: 'setPreviousHour',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case reducerTypes.setAppointments:
      return { ...state, appointments: action.payload };
    case reducerTypes.setPreviousHour:
      return { ...state, previousHourWidth: action.payload };
  }
};

const DoctorAppointmentsRow = ({
  doctor,
  hours,
  hourWidth,
  viewDate,
  onScheduleSelect,
}) => {
  const dispatch = useDispatch();
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const sizeDifference = useRef(0);
  const [{ appointments, previousHourWidth }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (doctor != null) {
      fetchAppointments();
    }
  }, [doctor, updateAppointments, viewDate]);

  useEffect(() => {
    sizeDifference.current = Math.abs(hourWidth - previousHourWidth);
    localDispatch(actions.setPreviousHour(hourWidth));
  }, [hourWidth]);

  const getRowHeight = doctor => {
    const doctorElement = document.getElementById(`doctor-${doctor.id}`);
    if (doctorElement == null) {
      return 0;
    }
    const doctorRect = doctorElement.getBoundingClientRect();
    return doctorRect.height;
  };

  const getAppointmentPosition = appointment => {
    const fromMinutes = appointment.start.minute();
    const fromMinutesPercent = (fromMinutes / 60) * 100;
    const toMinutesPercent = (appointment.serviceDuration / 60) * 100;
    const minutesWidth = (toMinutesPercent / 100) * hourWidth;
    return {
      x: fromMinutesPercent,
      width: minutesWidth,
    };
  };

  const fetchAppointments = async () => {
    dispatch(setIsCalendarLoading(true));
    const response = await dataAPI.fetchSchedules(doctor.id, viewDate);
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data } = response;
      const newData = data.map(item => {
        return {
          ...item,
          start: moment(item.dateAndTime, 'YYYY-MM-DD HH:mm:ss'),
          end: moment(item.dateAndTime, 'YYYY-MM-DD HH:mm:ss').add(
            item.serviceDuration,
            'minutes',
          ),
        };
      });
      localDispatch(actions.setAppointments(newData));

      setTimeout(() => {
        dispatch(toggleUpdateCalendarDoctorHeight());
      }, 300);
    }
    dispatch(setIsCalendarLoading(false));
  };

  const appointmentsForHour = hour => {
    const [hours] = hour.split(':');
    const hourNumber = parseInt(hours);
    const hourTime = moment(viewDate).set({ hour: hourNumber, minute: 0 });
    let newItems = appointments.filter(item => {
      return item.start.hour() === hourTime.hour();
    });

    return sortBy(newItems, it => it.start);
  };

  const getMargin = () => {
    if (hours.length === 0) {
      return 0;
    }
    const firstHour = hours[0];
    const hourEl = document.getElementById(firstHour);
    if (hourEl == null) {
      return 0;
    }
    const hourRect = hourEl.getBoundingClientRect();
    const parentRect = document
      .getElementById('hours-container')
      .getBoundingClientRect();
    return hourRect.x - parentRect.x + hourRect.width / 2;
  };

  const getHourWidth = index => {
    const newHours = hours.filter(it => it.split(':')[1] === '00');
    if (index >= newHours.length) {
      return 0;
    }
    const hourEl = document.getElementById(newHours[index]);
    const nextHourEl = document.getElementById(newHours[index + 1]);
    if (hourEl == null || nextHourEl == null) {
      return 0;
    }
    const hourRect = hourEl.getBoundingClientRect();
    const nextHourRect = nextHourEl.getBoundingClientRect();

    const startX = hourRect.x + hourRect.width / 2;
    const endX = nextHourRect.x + nextHourRect.width / 2;
    return endX - startX;
  };

  return (
    <div
      id={`appointments-${doctor.id}`}
      key={doctor.id}
      className='doctor-appointments-row'
      style={{ minHeight: getRowHeight(doctor) }}
    >
      <table
        style={{
          height: `calc(${getRowHeight(doctor)}px - 1rem)`,
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          marginLeft: getMargin(),
          marginRight: getMargin(),
        }}
      >
        <tbody>
          <tr style={{ display: 'flex', height: '100%' }}>
            {hours
              .filter(item => item.split(':')[1] === '00')
              .map((hour, index) => {
                return (
                  <td
                    style={{ width: getHourWidth(index) }}
                    key={hour}
                    id={hour}
                    className='appointment-cell'
                  >
                    {appointmentsForHour(hour).map((item, index) => (
                      <AppointmentItem
                        hidden={item.hidden}
                        zIndex={index + 1}
                        onSelect={onScheduleSelect}
                        key={item.id}
                        getPosition={getAppointmentPosition}
                        appointments={appointments}
                        appointment={item}
                        hourWidth={hourWidth}
                      />
                    ))}
                  </td>
                );
              })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const AppointmentItem = ({ appointment, hidden, onSelect }) => {
  const title = `${appointment.patientName} ${appointment.start.format(
    'HH:mm',
  )} - ${appointment.end.format('HH:mm')}`;

  const handleScheduleClick = () => {
    if (hidden) {
      return;
    }
    onSelect(appointment);
  };

  return (
    <Tooltip title={title} disableHoverListener={hidden}>
      <animated.div
        id={`${appointment.id}-${appointment.start.format(
          'HH:mm',
        )}>${appointment.end.format('HH:mm')}`}
        key={appointment.id}
        className='appointment-item'
        onClick={handleScheduleClick}
        style={{
          visibility: hidden ? 'hidden' : 'visible',
          width: '100%',
          border: `${appointment.serviceColor} 1px solid`,
          backgroundColor: `${appointment.serviceColor}1A`,
        }}
      >
        <Typography
          noWrap
          classes={{ root: 'patient-name' }}
          style={{ color: appointment.serviceColor }}
        >
          {appointment.patientName}
        </Typography>
        <Typography noWrap classes={{ root: 'patient-name' }}>
          {appointment.start.format('HH:mm')} -{' '}
          {appointment.end.format('HH:mm')}
        </Typography>
      </animated.div>
    </Tooltip>
  );
};

AppointmentItem.propTypes = {
  zIndex: PropTypes.number,
  hidden: PropTypes.bool,
  onSelect: PropTypes.func,
  hourWidth: PropTypes.number,
  getPosition: PropTypes.func,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      start: PropTypes.any,
      end: PropTypes.any,
      dateAndTime: PropTypes.string,
      doctorId: PropTypes.string,
      serviceDuration: PropTypes.number,
      serviceColor: PropTypes.string,
    }),
  ),
  appointment: PropTypes.shape({
    id: PropTypes.string,
    dateAndTime: PropTypes.string,
    start: PropTypes.any,
    end: PropTypes.any,
    doctorId: PropTypes.string,
    serviceDuration: PropTypes.number,
    serviceColor: PropTypes.string,
    patientName: PropTypes.string,
  }),
};

DoctorAppointmentsRow.propTypes = {
  onScheduleSelect: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
  hours: PropTypes.arrayOf(PropTypes.string),
  hourWidth: PropTypes.number,
  doctor: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  windowSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

export default DoctorAppointmentsRow;
