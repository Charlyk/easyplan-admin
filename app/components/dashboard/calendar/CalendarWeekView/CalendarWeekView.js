import React, { useEffect, useState } from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import { getCurrentWeek } from '../../../../../utils/helperFuncs';
import CalendarWeekDayView from './CalendarWeekDayView';
import styles from './CalendarWeekView.module.scss';
import EasyCalendar from "../../../common/EasyCalendar";

const CalendarWeekView = (
  {
    doctorId,
    doctors,
    schedules: {
      hours,
      schedules
    },
    viewDate,
    onDateClick,
    onScheduleSelect,
    onCreateSchedule,
  }
) => {
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [week, setWeek] = useState(getCurrentWeek(viewDate));
  useEffect(() => {
    console.log(schedules);
  }, [])

  useEffect(() => {
    setWeek(getCurrentWeek(viewDate));
  }, [viewDate, updateAppointments]);

  const handleDayClick = (day) => {
    const date = moment(day.id).toDate();
    onDateClick(date, true);
  };

  const handleCreateSchedule = (startHour, endHour, doctorId, selectedDate) => {
    const dayDate = moment(selectedDate).toDate()
    const doctor = doctors.find(item => item.id === doctorId);
    onCreateSchedule(doctor, startHour, endHour, dayDate);
  }

  const mappedWeek = week.map((date) => {
    return {
      id: moment(date).format('YYYY-MM-DD'),
      doctorId,
      name: moment(date).format('DD dddd'),
      disabled: false,
      date: date,
    };
  });

  return (
    <div className={styles['week-view']}>
      <EasyCalendar
        viewDate={viewDate}
        dayHours={hours}
        schedules={schedules}
        columns={mappedWeek}
        animatedStatuses={['WaitingForPatient']}
        onScheduleSelected={onScheduleSelect}
        onAddSchedule={handleCreateSchedule}
        onHeaderItemClick={handleDayClick}
      />
    </div>
  );
};

export default CalendarWeekView;

CalendarWeekView.propTypes = {
  onScheduleSelect: PropTypes.func,
  opened: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
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

CalendarWeekDayView.defaulProps = {
  onScheduleSelect: () => null,
};
