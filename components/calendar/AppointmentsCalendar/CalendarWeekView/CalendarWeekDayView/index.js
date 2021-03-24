import React, { useEffect, useState } from 'react';

import { TableCell } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { setIsCalendarLoading } from '../../../../../redux/actions/calendar';
import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import ScheduleItem from '../../../ScheduleItem';
import styles from '../../../../../styles/CalendarWeekDayView.module.scss'
import { toast } from "react-toastify";
import axios from "axios";
import { baseAppUrl } from "../../../../../eas.config";

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
    if (doctorId == null) return;
    dispatch(setIsCalendarLoading(true));
    try {
      const query = { doctorId, date: day.format('YYYY-MM-DD'), period: 'week' };
      const queryString = new URLSearchParams(query).toString();
      const response = await axios.get(`${baseAppUrl}/api/schedules?${queryString}`);
      const { data } = response;
      const newData = sortBy(data, item => item.startTime);
      setSchedules(newData);
      if (
        selectedSchedule != null &&
        day.isSame(selectedSchedule.startTime, 'day')
      ) {
        onScheduleSelect(newData.find(item => item.id === selectedSchedule.id));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setIsCalendarLoading(false));
    }
  };

  return (
    <TableCell className={styles['week-day']} variant='body'>
      {schedules.map(schedule => (
        <ScheduleItem
          hidden={schedule.hidden}
          onSelect={onScheduleSelect}
          key={`${schedule.id}`}
          appointment={schedule}
        />
      ))}
    </TableCell>
  );
};

export default CalendarWeekDayView;

CalendarWeekDayView.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
  update: PropTypes.bool,
  doctorId: PropTypes.number,
  day: PropTypes.object,
  onScheduleSelect: PropTypes.func,
  selectedSchedule: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
  }),
};

CalendarWeekDayView.defaultProps = {
  onScheduleSelect: () => null,
};