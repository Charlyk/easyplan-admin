import React from "react";
import PropTypes from 'prop-types';
import Header from "./Header";
import Hours from "./Hours";
import ColumnsWrapper from "./ColumnsWrapper";
import HourIndicator from "./HourIndicator";
import styles from './EasyCalendar.module.scss';

const EasyCalendar = (
  {
    dayHours,
    columns,
    schedules,
    viewDate,
    hourIndicator,
    showHourIndicator,
    animatedStatuses,
    hideCreateIndicator,
    onAddSchedule,
    onScheduleSelected,
    onHeaderItemClick,
  }
) => {
  return (
    <div className={styles.calendarRoot}>
      <Header items={columns} onItemClick={onHeaderItemClick}/>
      <div className={styles.calendarContainer}>
        <HourIndicator
          disabled={!hourIndicator || dayHours.length === 0 || !showHourIndicator}
          dayHours={dayHours}
          viewDate={viewDate}
        />
        <Hours hours={dayHours}/>
        <ColumnsWrapper
          schedules={schedules}
          hours={dayHours}
          columns={columns}
          hideCreateIndicator={hideCreateIndicator}
          animatedStatuses={animatedStatuses}
          onAddSchedule={onAddSchedule}
          onScheduleSelected={onScheduleSelected}
        />
      </div>
    </div>
  )
};

export default EasyCalendar;

EasyCalendar.propTypes = {
  hourIndicator: PropTypes.bool,
  dayHours: PropTypes.arrayOf(PropTypes.string).isRequired,
  viewDate: PropTypes.instanceOf(Date).isRequired,
  showHourIndicator: PropTypes.bool,
  hideCreateIndicator: PropTypes.bool,
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      schedules: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          comment: PropTypes.string,
          doctorId: PropTypes.number,
          startTime: PropTypes.string,
          endTime: PropTypes.string,
          isUrgent: PropTypes.bool,
          urgent: PropTypes.bool,
          patient: PropTypes.shape({
            id: PropTypes.number,
            fullName: PropTypes.string,
          }),
          scheduleStatus: PropTypes.string,
          serviceColor: PropTypes.string,
          serviceCurrency: PropTypes.string,
          serviceId: PropTypes.number,
          serviceName: PropTypes.string,
          servicePrice: PropTypes.number,
          type: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      doctorId: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.instanceOf(Date),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  animatedStatuses: PropTypes.arrayOf(
    PropTypes.oneOf([
      'Pending',
      'OnSite',
      'Confirmed',
      'WaitingForPatient',
      'Late',
      'DidNotCome',
      'Canceled',
      'CompletedNotPaid',
      'CompletedPaid',
      'PartialPaid',
      'Paid',
      'Rescheduled',
    ])
  ),
  onAddSchedule: PropTypes.func,
  onScheduleSelected: PropTypes.func,
  onHeaderItemClick: PropTypes.func,
}

EasyCalendar.defaultProps = {
  hourIndicator: true,
  viewDate: new Date(),
  animatedStatuses: [],
  hideCreateIndicator: false,
  showHourIndicator: false,
  onAddSchedule: () => null,
  onScheduleSelected: () => null,
  onHeaderItemClick: () => null,
}
