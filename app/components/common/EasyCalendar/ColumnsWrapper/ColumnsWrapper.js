import React from "react";
import PropTypes from 'prop-types';
import Column from "./Column";
import styles from './ColumnsWrapper.module.scss';

export default function ColumnsWrapper(
  {
    schedules,
    hours,
    columns,
    hideCreateIndicator,
    animatedStatuses,
    onAddSchedule,
    onScheduleSelected
  }
) {
  function getSchedulesForColumn(column) {
    return schedules.find((item) => item.id === column.id)?.schedules ?? [];
  }

  return (
    <div className={styles.columnsWrapperRoot}>
      {columns.map((column) => (
        <Column
          key={column.id}
          animatedStatuses={animatedStatuses}
          schedules={getSchedulesForColumn(column)}
          hours={hours}
          column={column}
          hideCreateIndicator={hideCreateIndicator}
          onAddSchedule={onAddSchedule}
          onScheduleSelected={onScheduleSelected}
        />
      ))}
    </div>
  )
}

ColumnsWrapper.propTypes = {
  hours: PropTypes.arrayOf(PropTypes.string),
  hideCreateIndicator: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    doctorId: PropTypes.number,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
  })),
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
  ),
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
}

ColumnsWrapper.defaultProps = {
  onAddSchedule: () => null,
  onScheduleSelected: () => null,
}
