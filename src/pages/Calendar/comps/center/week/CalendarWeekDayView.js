import React, { useEffect, useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import dataAPI from '../../../../../utils/api/dataAPI';
import CalendarWeekHourView from './CalendarWeekHourView';
import WeekAppointmentItem from './WeekAppointmentItem';

const CalendarWeekDayView = ({ day, hours, doctorId }) => {
  const currentHour = moment().format('HH:00');
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (hours.length > 0 && doctorId != null) {
      fetchSchedules();
    }
  }, [doctorId, hours]);

  const fetchSchedules = async () => {
    const response = await dataAPI.fetchSchedules(doctorId, day.toDate());
    if (response.isError) {
      console.log(response.message);
    } else {
      setSchedules(response.data);
    }
  };

  return (
    <div className='week-day'>
      <div id='days-container' className='day-title'>
        {day.format('DD dddd')}
      </div>
      {hours.map(hour => (
        <CalendarWeekHourView
          key={`${hour}-${day}-key`}
          hour={hour}
          currentHour={hour === currentHour}
        />
      ))}
      {schedules.map(schedule => (
        <WeekAppointmentItem key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
};

export default CalendarWeekDayView;

CalendarWeekDayView.propTypes = {
  doctorId: PropTypes.string,
  day: PropTypes.string,
  hours: PropTypes.arrayOf(PropTypes.string),
};
