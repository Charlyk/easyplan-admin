import React, { useEffect, useReducer } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../../../../assets/icons/iconAvatar';
import { clinicActiveDoctorsSelector } from '../../../../../redux/selectors/clinicSelector';
import {
  updateAppointmentsSelector,
  updateCalendarDoctorHeightSelector,
} from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../../utils/helperFuncs';
import { useWindowSize } from '../../../../../utils/hooks';
import { textForKey } from '../../../../../utils/localization';
import DoctorAppointmentsRow from './DoctorAppointmentsRow';
import HourView from './HourView';

const initialState = {
  isLoading: false,
  hours: [],
  hourWidth: 0,
  daySchedules: [],
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setHours: 'setHours',
  setHourWidth: 'setHourWidth',
  setDaySchedules: 'setDaySchedules',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setHours:
      return { ...state, hours: action.payload };
    case reducerTypes.setHourWidth:
      return { ...state, hourWidth: action.payload };
    case reducerTypes.setDaySchedules:
      return { ...state, daySchedules: action.payload };
    default:
      return state;
  }
};

const CalendarDoctorsView = ({ viewDate, onScheduleSelect }) => {
  const windowSize = useWindowSize();
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [
    { isLoading, hours, hourWidth, daySchedules },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(
      actions.setDaySchedules(
        doctors.map(item => ({ doctor: item, schedules: [] })),
      ),
    );
    fetchWorkHours();
  }, [viewDate, doctors, updateAppointments]);

  useEffect(() => {
    updateHourWidth();
  }, [hours, windowSize]);

  const fetchDaySchedules = async () => {
    const response = await dataAPI.fetchDaySchedules(viewDate);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { data: schedules } = response;
      const mappedSchedules = doctors.map(item => {
        const doctorSchedules =
          schedules.find(it => it.doctor.id === item.id)?.schedules || [];
        return {
          doctor: item,
          schedules: doctorSchedules,
        };
      });
      localDispatch(actions.setDaySchedules(mappedSchedules));
    }
  };

  const updateHourWidth = () => {
    if (hours.length > 0) {
      // hours step is 30 minutes so we need to get next hour instead of next 30 minutes
      const fixHours = hours.filter(item => item.split(':')[1] === '00');
      const startEl = document.getElementById(fixHours[0]);
      const endEl = document.getElementById(fixHours[1]);
      if (startEl != null && endEl != null) {
        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();
        const startX = startRect.x + startRect.width / 2;
        const endX = endRect.x + endRect.width / 2;
        localDispatch(actions.setHourWidth(endX - startX));
      }
    }
  };

  const fetchWorkHours = async () => {
    localDispatch(actions.setIsLoading(true));
    const day = moment(viewDate).isoWeekday();
    const response = await dataAPI.fetchClinicWorkHoursV2(day);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setHours(response.data));
      await fetchDaySchedules();
    }
    localDispatch(actions.setIsLoading(false));
  };

  const fixHours = hours.filter(item => item.split(':')[1] === '00');

  const getCellWidth = () => {
    const element = document.getElementById('calendar-content');
    const elementRect = element.getBoundingClientRect();
    return Math.abs((elementRect.width - 212) / fixHours.length);
  };

  return (
    <div id='day-view-root' className='calendar-doctors-view'>
      {isLoading && (
        <div className='loading-progress-wrapper'>
          <CircularProgress classes={{ root: 'loading-schedules-progress' }} />
        </div>
      )}
      {!isLoading && fixHours.length === 0 && (
        <Typography classes={{ root: 'day-off-label' }}>
          {textForKey("It's a day off")}
        </Typography>
      )}
      {fixHours.length > 0 && (
        <Box display='flex' flexDirection='column' height='100%' width='100%'>
          <table>
            <thead>
              <tr>
                <td width={211}>
                  <Typography classes={{ root: 'title-label' }}>
                    {textForKey('Doctors')}
                  </Typography>
                </td>
                {fixHours.map(item => (
                  <td
                    width={getCellWidth()}
                    style={{ maxWidth: getCellWidth() }}
                    key={item}
                  >
                    <HourView hour={item} />
                  </td>
                ))}
              </tr>
            </thead>
          </table>
          <div className='calendar-doctors-view__appointments-wrapper'>
            <table>
              <tbody>
                {daySchedules.map(item => (
                  <DoctorAppointmentsRow
                    onScheduleSelect={onScheduleSelect}
                    viewDate={viewDate}
                    hours={hours}
                    windowSize={windowSize}
                    key={item.id}
                    schedules={item.schedules || []}
                    doctor={item.doctor}
                    hourWidth={hourWidth}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      )}
    </div>
  );
};

const DoctorRow = ({ doctor, clinicServices }) => {
  const updateHeight = useSelector(updateCalendarDoctorHeightSelector);
  const doctorServices = doctor.services.map(it => it.id);
  const services = clinicServices
    .filter(it => doctorServices.includes(it.id))
    .map(it => it.name);

  const getRowHeight = () => {
    const doctorElement = document.getElementById(`appointments-${doctor.id}`);
    if (doctorElement == null) {
      return 0;
    }
    const doctorRect = doctorElement.getBoundingClientRect();
    return doctorRect.height;
  };

  return (
    <div
      id={`doctor-${doctor.id}`}
      style={{ minHeight: getRowHeight() }}
      className='calendar-doctors-view__doctor-row'
    >
      <div className='doctor-info-wrapper'>
        <div className='avatar-wrapper'>
          <IconAvatar />
        </div>
        <div className='name-and-services'>
          <span className='doctor-name'>
            {doctor.firstName} {doctor.lastName}
          </span>
          <Typography classes={{ root: 'services-names' }}>
            {services.join(', ')}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CalendarDoctorsView;

CalendarDoctorsView.propTypes = {
  onScheduleSelect: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
};

DoctorRow.propTypes = {
  onScheduleSelect: PropTypes.func,
  clinicServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  doctor: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      }),
    ),
  }),
};

HourView.propTypes = {
  hour: PropTypes.string.isRequired,
};
