import React, { useEffect, useReducer, useRef } from 'react';

import { Box, Tooltip, Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import IconAvatar from '../../../../../assets/icons/iconAvatar';
import { clinicServicesSelector } from '../../../../../redux/selectors/clinicSelector';
import { generateReducerActions } from '../../../../../utils/helperFuncs';
import '../../../styles.scss';
import ScheduleItem from '../ScheduleItem';

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
  schedules,
  hours,
  hourWidth,
  viewDate,
  onScheduleSelect,
}) => {
  const clinicServices = useSelector(clinicServicesSelector);
  const sizeDifference = useRef(0);
  const [{ appointments, previousHourWidth }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    const newData = schedules.map(item => {
      return {
        ...item,
        start: moment(item.startTime),
        end: moment(item.endTime),
      };
    });
    localDispatch(actions.setAppointments(newData));
  }, [schedules]);

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
    return Math.abs((elementRect.width - 212) / fixHours.length);
  };

  return (
    <tr>
      <td width={212}>
        <div className='doctor-row'>
          <div className='doctor-info-wrapper'>
            <div className='avatar-wrapper'>
              <IconAvatar />
            </div>
            <Tooltip
              title={
                <Box display='flex' flexDirection='column' padding='0.5rem'>
                  {doctorServices().map((item, index) => (
                    <Typography
                      classes={{ root: 'calendar-service-tooltip-label' }}
                      key={`${item}-${index}`}
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
      {fixHours.map((hour, index) => {
        return (
          <td
            width={getCellWidth()}
            style={{ maxWidth: getCellWidth() }}
            key={`${hour}-${index}`}
            id={hour}
            className='appointment-cell'
            valign='top'
          >
            {appointmentsForHour(hour).map((item, index) => (
              <ScheduleItem
                hidden={item.hidden}
                zIndex={index + 1}
                onSelect={onScheduleSelect}
                key={`${item.id}`}
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

DoctorAppointmentsRow.propTypes = {
  onScheduleSelect: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
  hours: PropTypes.arrayOf(PropTypes.string),
  hourWidth: PropTypes.number,
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      scheduleStatus: PropTypes.string,
      serviceId: PropTypes.number,
      serviceName: PropTypes.string,
      serviceColor: PropTypes.string,
      patient: PropTypes.shape({
        id: PropTypes.number,
        fullName: PropTypes.string,
      }),
      start: PropTypes.object,
      end: PropTypes.object,
    }),
  ),
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
