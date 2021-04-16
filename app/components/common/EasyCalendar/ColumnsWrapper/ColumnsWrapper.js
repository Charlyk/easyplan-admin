import React from "react";
import PropTypes from 'prop-types';
import Column from "./Column";
import styles from './ColumnsWrapper.module.scss';

const ColumnsWrapper = ({ schedules, hours, columns, viewDate, onAddSchedule, onScheduleSelected }) => {
  const getSchedulesForColumn = (column) => {
    return schedules.find((item) => item.id === column.id)?.schedules ?? [];
  }

  return (
    <div className={styles.columnsWrapperRoot}>
      {columns.map((column) => (
        <Column
          key={column.id}
          viewDate={viewDate}
          schedules={getSchedulesForColumn(column)}
          hours={hours}
          column={column}
          onAddSchedule={onAddSchedule}
          onScheduleSelected={onScheduleSelected}
        />
      ))}
    </div>
  )
}

export default ColumnsWrapper;

ColumnsWrapper.propTypes = {
  hours: PropTypes.arrayOf(PropTypes.string),
  viewDate: PropTypes.instanceOf(Date),
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    disabled: PropTypes.bool,
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
  onAddSchedule: PropTypes.func,
  onScheduleSelected: PropTypes.func,
}

ColumnsWrapper.defaultProps = {
  onAddSchedule: () => null,
  onScheduleSelected: () => null,
}
