import React, { useEffect, useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import CalendarWeekHourView from './CalendarWeekHourView';
import WeekAppointmentItem from './WeekAppointmentItem';

const CalendarWeekDayView = ({
  day,
  hours,
  doctorId,
  selectedSchedule,
  onScheduleSelect,
}) => {
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const currentHour = moment().format('HH:00');
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (hours.length > 0 && doctorId != null) {
      fetchSchedules();
    }
  }, [doctorId, hours, updateAppointments]);

  const fetchSchedules = async () => {
    const response = await dataAPI.fetchSchedules(doctorId, day.toDate());
    if (response.isError) {
      console.log(response.message);
    } else {
      const { data } = response;
      setSchedules(data);
      if (
        selectedSchedule != null &&
        day.isSame(selectedSchedule.dateAndTime, 'day')
      ) {
        onScheduleSelect(data.find(item => item.id === selectedSchedule.id));
      }
    }
  };

  return (
    <td className='week-day' valign='top'>
      {schedules.map(schedule => (
        <WeekAppointmentItem
          onSelect={onScheduleSelect}
          key={schedule.id}
          schedule={schedule}
        />
      ))}
    </td>
  );
};

export default CalendarWeekDayView;

CalendarWeekDayView.propTypes = {
  doctorId: PropTypes.string,
  day: PropTypes.string,
  hours: PropTypes.arrayOf(PropTypes.string),
  onScheduleSelect: PropTypes.func,
  selectedSchedule: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    doctorId: PropTypes.string,
    doctorName: PropTypes.string,
    serviceId: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceDuration: PropTypes.string,
    dateAndTime: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};

CalendarWeekDayView.defaultProps = {
  onScheduleSelect: () => null,
};
