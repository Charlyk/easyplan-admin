import React, { useEffect, useReducer } from 'react';

import { Box, Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../../../../assets/icons/iconAvatar';
import { clinicActiveDoctorsSelector } from '../../../../../redux/selectors/clinicSelector';
import { updateCalendarDoctorHeightSelector } from '../../../../../redux/selectors/rootSelector';
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
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setHours: 'setHours',
  setHourWidth: 'setHourWidth',
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
    default:
      return state;
  }
};

const CalendarDoctorsView = ({ viewDate, onScheduleSelect }) => {
  const windowSize = useWindowSize();
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const [{ isLoading, hours, hourWidth }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    fetchWorkHours();
  }, [viewDate]);

  useEffect(() => {
    updateHourWidth();
  }, [hours, windowSize]);

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
    }
    localDispatch(actions.setIsLoading(false));
  };

  const fixHours = hours.filter(item => item.split(':')[1] === '00');

  const getCellWidth = () => {
    const element = document.getElementById('calendar-content');
    const elementRect = element.getBoundingClientRect();
    return Math.abs((elementRect.width - 210) / fixHours.length);
  };

  return (
    <div id='day-view-root' className='calendar-doctors-view'>
      {!isLoading && fixHours.length === 0 && (
        <Typography classes={{ root: 'day-off-label' }}>
          {textForKey("It's a day off")}
        </Typography>
      )}
      {!isLoading && fixHours.length > 0 && (
        <Box display='flex' flexDirection='column'>
          <table>
            <thead>
              <tr>
                <td width={210}>
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
                {doctors.map(item => (
                  <DoctorAppointmentsRow
                    onScheduleSelect={onScheduleSelect}
                    viewDate={viewDate}
                    hours={hours}
                    windowSize={windowSize}
                    key={item.id}
                    doctor={item}
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
