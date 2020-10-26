import React, { useEffect, useState } from 'react';

import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { setIsCalendarLoading } from '../../../../../redux/actions/calendar';
import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import WeekAppointmentItem from './WeekAppointmentItem';

const CalendarWeekDayView = ({
  viewDate,
  day,
  doctorId,
  selectedSchedule,
  onScheduleSelect,
  update,
}) => {
  const dispatch = useDispatch();
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, [doctorId, updateAppointments, update, viewDate]);

  const fetchSchedules = async () => {
    dispatch(setIsCalendarLoading(true));
    const response = await dataAPI.fetchSchedules(doctorId, day.toDate());
    if (response.isError) {
      console.log(response.message);
    } else {
      const { data } = response;
      const newData = sortBy(data, item => item.dateAndTime);
      setSchedules(newData);
      if (
        selectedSchedule != null &&
        day.isSame(selectedSchedule.dateAndTime, 'day')
      ) {
        onScheduleSelect(newData.find(item => item.id === selectedSchedule.id));
      }
    }
    dispatch(setIsCalendarLoading(false));
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
  viewDate: PropTypes.instanceOf(Date),
  update: PropTypes.bool,
  doctorId: PropTypes.string,
  day: PropTypes.object,
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
