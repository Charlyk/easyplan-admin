import React, { useEffect, useReducer, useRef, useState } from 'react';

import { Tooltip, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import clsx from 'clsx';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import IconAvatar from '../../../../../assets/icons/iconAvatar';
import { toggleUpdateCalendarDoctorHeight } from '../../../../../redux/actions/actions';
import { setIsCalendarLoading } from '../../../../../redux/actions/calendar';
import { clinicServicesSelector } from '../../../../../redux/selectors/clinicSelector';
import {
  checkAppointmentsSelector,
  updateAppointmentsSelector,
} from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import {
  checkShouldAnimateSchedule,
  generateReducerActions,
} from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import HourView from './HourView';

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
  const clinicServices = useSelector(clinicServicesSelector);
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
          start: moment(item.dateAndTime),
          end: moment(item.dateAndTime).add(item.serviceDuration, 'minutes'),
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

  console.log(doctor);

  const doctorServices = () => {
    const servicesIds = doctor.services.map(it => it.id);
    return clinicServices
      .filter(item => servicesIds.includes(item.id))
      .map(it => it.name);
  };

  const fixHours = hours.filter(item => item.split(':')[1] === '00');

  const getCellWidth = () => {
    const element = document.getElementById('calendar-content');
    const elementRect = element.getBoundingClientRect();
    return Math.abs((elementRect.width - 210) / fixHours.length);
  };

  return (
    <tr>
      <td width={210}>
        <div className='doctor-row'>
          <div className='doctor-info-wrapper'>
            <div className='avatar-wrapper'>
              <IconAvatar />
            </div>
            <Tooltip title={doctorServices().join(', ')}>
              <div className='name-and-services'>
                <Typography noWrap classes={{ root: 'doctor-name' }}>
                  {`${doctor.firstName} ${doctor.lastName}`}
                </Typography>
                <Typography noWrap classes={{ root: 'services-names' }}>
                  {doctorServices().join(', ')}
                </Typography>
              </div>
            </Tooltip>
          </div>
        </div>
      </td>
      {fixHours.map(hour => {
        return (
          <td
            width={getCellWidth()}
            style={{ maxWidth: getCellWidth() }}
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
  );
};

const AppointmentItem = ({ appointment, hidden, onSelect }) => {
  const dispatch = useDispatch();
  const checkAppointment = useSelector(checkAppointmentsSelector);
  const [animateSchedule, setAnimateSchedule] = useState(false);
  const title = `${appointment.patientName} ${appointment.start.format(
    'HH:mm',
  )} - ${appointment.end.format('HH:mm')}`;

  useEffect(() => {
    setAnimateSchedule(dispatch(checkShouldAnimateSchedule(appointment)));
  }, [checkAppointment, appointment]);

  const handleScheduleClick = () => {
    if (hidden) {
      return;
    }
    onSelect(appointment);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      id={`${appointment.id}-${appointment.start.format(
        'HH:mm',
      )}>${appointment.end.format('HH:mm')}`}
      key={appointment.id}
      className={clsx('appointment-item', animateSchedule && 'upcoming')}
      onClick={handleScheduleClick}
      style={{
        border: `${appointment.serviceColor} 1px solid`,
        backgroundColor: `${appointment.serviceColor}1A`,
      }}
    >
      <div className='name-and-status'>
        <Typography noWrap classes={{ root: 'patient-name' }}>
          {appointment.patientName}
        </Typography>
        <div className='status-icon'>
          {appointment.status === 'OnSite' && <DoneIcon />}
          {(appointment.status === 'CompletedPaid' ||
            appointment.status === 'PartialPaid') && <DoneAllIcon />}
        </div>
      </div>
      <Typography noWrap classes={{ root: 'patient-name' }}>
        {appointment.start.format('HH:mm')} - {appointment.end.format('HH:mm')}
      </Typography>
    </div>
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
      status: PropTypes.string,
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
    status: PropTypes.string,
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
    services: PropTypes.arrayOf(PropTypes.object),
  }),
  windowSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

export default DoctorAppointmentsRow;
