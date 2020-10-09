import React, { useEffect, useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import EasyTab from '../../../../components/EasyTab';
import { updateAppointmentsSelector } from '../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';
import CalendarDayView from './day/CalendarDayView';
import CalendarMonthView from './month/CalendarMonthView';
import CalendarWeekView from './week/CalendarWeekView';

const CalendarView = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'ear',
};

const AppointmentsCalendar = ({ doctor, viewDate }) => {
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [hours, setHours] = useState([]);
  const [currentTab, setCurrentTab] = useState(CalendarView.day);

  useEffect(() => {
    setHours([]);
    setSchedules([]);
    fethWorkHours();
  }, [viewDate]);

  useEffect(() => {
    if (hours.length === 0) {
      fethWorkHours();
    } else if (doctor != null) {
      fetchSchedules();
    }
  }, [doctor, updateAppointments]);

  const fethWorkHours = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchClinicWorkHours(
      moment(viewDate).isoWeekday(),
    );
    if (response.isError) {
      console.error(response.message);
    } else {
      setHours(response.data);
      if (doctor != null) {
        await fetchSchedules();
      }
    }
    setIsLoading(false);
  };

  const fetchSchedules = async () => {
    if (hours.length === 0) {
      return;
    }
    setIsLoading(true);
    const response = await dataAPI.fetchSchedules(doctor.id, viewDate);
    if (response.isError) {
      console.error(response.message);
    } else {
      setSchedules(response.data);
    }
    setIsLoading(false);
  };

  const handleTabChange = newTab => {
    setCurrentTab(newTab);
  };

  return (
    <div className='calendar-root__center'>
      <div className='center-header'>
        <span className='center-header__date'>
          {moment(viewDate).format('DD MMMM YYYY')}
        </span>
        <div className='center-header__tabs'>
          <EasyTab
            title={textForKey('Day')}
            selected={currentTab === CalendarView.day}
            onClick={() => handleTabChange(CalendarView.day)}
          />
          <EasyTab
            title={textForKey('Week')}
            selected={currentTab === CalendarView.week}
            onClick={() => handleTabChange(CalendarView.week)}
          />
          <EasyTab
            title={textForKey('Month')}
            selected={currentTab === CalendarView.month}
            onClick={() => handleTabChange(CalendarView.month)}
          />
        </div>
      </div>
      <div className='center-content'>
        {isLoading && (
          <Spinner animation='border' className='loading-spinner' />
        )}
        {hours.length === 0 && !isLoading && (
          <span className='day-off-label'>{textForKey("It's a day off")}</span>
        )}
        <CalendarDayView
          hours={hours}
          schedules={schedules}
          opened={currentTab === CalendarView.day}
        />
        <CalendarWeekView
          schedules={schedules}
          opened={currentTab === CalendarView.week}
        />
        <CalendarMonthView
          schedules={schedules}
          opened={currentTab === CalendarView.month}
        />
      </div>
    </div>
  );
};

export default AppointmentsCalendar;

AppointmentsCalendar.propTypes = {
  doctor: PropTypes.object,
  viewDate: PropTypes.instanceOf(Date),
};

AppointmentsCalendar.defaultProps = {
  viewDate: new Date(),
};
