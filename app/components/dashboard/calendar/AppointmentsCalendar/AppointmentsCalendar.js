import React from 'react';

import { CircularProgress, } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { isCalendarLoadingSelector } from '../../../../../redux/selectors/calendarSelector';
import { getCurrentWeek } from '../../../../../utils/helperFuncs';
import AppointmentDetails from '../AppointmentDetails';
import CalendarHeader from "../CalendarHeader";
import styles from './AppointmentsCalendar.module.scss'

const CalendarView = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'ear',
};

const AppointmentsCalendar = (
  {
    viewDate,
    viewMode: currentTab,
    selectedSchedule,
    canAddAppointment,
    children,
    onPayDebt,
    onViewDateChange,
    onEditSchedule,
    onDeleteSchedule,
    onScheduleSelect,
    onViewModeChange,
    onAddAppointment,
    onImportSchedules,
  }
) => {
  const isLoading = useSelector(isCalendarLoadingSelector);

  const handleTabChange = (newTab) => {
    onViewModeChange(newTab);
  };

  const getTitleText = () => {
    switch (currentTab) {
      case CalendarView.day:
        return moment(viewDate).format('DD MMMM YYYY');
      case CalendarView.week: {
        const week = getCurrentWeek(viewDate);
        return `${week[0].format('DD MMM')} - ${week[week.length - 1].format(
          'DD MMM',
        )}`;
      }
      case CalendarView.month:
        return moment(viewDate).format('MMMM YYYY');
    }
  };

  const handleDetailsClose = () => {
    onScheduleSelect(null);
  };

  const handleAddAppointment = () => {
    onAddAppointment();
  };

  return (
    <div className={clsx(styles.appointmentsCalendar, 'full-height')}>
      {selectedSchedule != null && (
        <AppointmentDetails
          onPayDebt={onPayDebt}
          onDelete={onDeleteSchedule}
          onEdit={onEditSchedule}
          schedule={selectedSchedule}
          onClose={handleDetailsClose}
        />
      )}
      <CalendarHeader
        viewDate={viewDate}
        dateBtnText={getTitleText()}
        currentTab={currentTab}
        canAddAppointment={canAddAppointment}
        onImportSchedules={onImportSchedules}
        onTabChange={handleTabChange}
        onDateChange={onViewDateChange}
        onAddAppointment={handleAddAppointment}
      />
      <div
        id='calendar-content'
        style={{
          marginRight: 0,
          marginLeft: currentTab === CalendarView.day ? '0' : '1rem',
        }}
        className={styles['center-content']}
      >
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
          </div>
        )}
        {React.cloneElement(
          children,
          {
            ...children.props,
            onScheduleSelect,
            onDateClick: onViewDateChange,
            onCreateSchedule: onAddAppointment,
          }
        )}
      </div>
    </div>
  );
};

export default AppointmentsCalendar;

AppointmentsCalendar.propTypes = {
  isUploading: PropTypes.bool,
  doctor: PropTypes.object,
  viewDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func,
  onViewDateChange: PropTypes.func,
  onScheduleSelect: PropTypes.func,
  onViewModeChange: PropTypes.func,
  canAddAppointment: PropTypes.bool,
  onAddAppointment: PropTypes.func,
  onDeleteSchedule: PropTypes.func,
  onEditSchedule: PropTypes.func,
  onPayDebt: PropTypes.func,
  onImportSchedules: PropTypes.func,
  selectedSchedule: PropTypes.shape({
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

AppointmentsCalendar.defaultProps = {
  viewDate: new Date(),
  onViewDateChange: () => null,
  onScheduleSelect: () => null,
  onImportSchedules: () => null,
};
