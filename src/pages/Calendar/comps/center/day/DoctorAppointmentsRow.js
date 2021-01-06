import React, { useEffect, useReducer, useRef } from 'react';

import { Box, Tooltip, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import clsx from 'clsx';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../../../../assets/icons/iconAvatar';
import { toggleUpdateCalendarDoctorHeight } from '../../../../../redux/actions/actions';
import { setIsCalendarLoading } from '../../../../../redux/actions/calendar';
import { clinicServicesSelector } from '../../../../../redux/selectors/clinicSelector';
import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import '../../../styles.scss';

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
      toast.error(textForKey(response.message));
    } else {
      const { data } = response;
      const newData = data.map(item => {
        return {
          ...item,
          start: moment(item.startTime),
          end: moment(item.endTime),
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

  const doctorServices = () => {
    const servicesIds = doctor.services.map(it => it.serviceId);
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
            <Tooltip
              title={
                <Box display='flex' flexDirection='column' padding='0.5rem'>
                  {doctorServices().map(item => (
                    <Typography
                      classes={{ root: 'calendar-service-tooltip-label' }}
                      key={item}
                    >
                      - {item}
                    </Typography>
                  ))}
                </Box>
              }
            >
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
            valign='top'
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
  const shouldAnimate = appointment.scheduleStatus === 'WaitingForPatient';

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
      className={clsx('appointment-item', shouldAnimate && 'upcoming')}
      onClick={handleScheduleClick}
      style={{
        border: `${appointment.serviceColor} 1px solid`,
        backgroundColor: `${appointment.serviceColor}1A`,
      }}
    >
      <div className='name-and-status'>
        <Typography noWrap classes={{ root: 'patient-name' }}>
          {appointment.patient.fullName}
        </Typography>
        <div className='status-icon'>
          {appointment.scheduleStatus === 'OnSite' && <DoneIcon />}
          {(appointment.scheduleStatus === 'CompletedPaid' ||
            appointment.scheduleStatus === 'PartialPaid') && <DoneAllIcon />}
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
      id: PropTypes.number,
      patient: PropTypes.shape({
        id: PropTypes.number,
        fullName: PropTypes.string,
      }),
      serviceName: PropTypes.string,
      serviceColor: PropTypes.string,
      start: PropTypes.object,
      end: PropTypes.object,
      scheduleStatus: PropTypes.string,
    }),
  ),
  appointment: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
    scheduleStatus: PropTypes.string,
  }),
};

DoctorAppointmentsRow.propTypes = {
  onScheduleSelect: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
  hours: PropTypes.arrayOf(PropTypes.string),
  hourWidth: PropTypes.number,
  doctor: PropTypes.shape({
    id: PropTypes.number,
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
