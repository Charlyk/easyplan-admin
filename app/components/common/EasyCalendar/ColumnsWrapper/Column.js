import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import ColumnCell from "./ColumnCell";
import moment from "moment-timezone";
import Schedule from "../Schedule/Schedule";
import createContainerHours from "../../../../utils/createContainerHours";
import styles from './ColumnsWrapper.module.scss';

const Column = ({ schedules, hours, column, viewDate, onAddSchedule, onScheduleSelected }) => {
  const hoursContainers = useMemo(() => {
    return createContainerHours(hours);
  }, [hours]);

  const handleAddSchedule = (startHour, endHour) => {
    onAddSchedule(startHour, endHour, column.id)
  }

  const schedulesWithOffset = useMemo(() => {
    const newSchedules = [];
    // check if schedules intersect other schedules and update their offset
    for (let schedule of schedules) {
      const scheduleRange = moment.range(
        moment(schedule.startTime),
        moment(schedule.endTime),
      );
      schedule.offset = 0;
      // update new schedule offset based on already added schedules
      for (let item of newSchedules) {
        const itemRange = moment.range(
          moment(item.startTime),
          moment(item.endTime),
        );
        const hasIntersection = scheduleRange.intersect(itemRange) != null;
        if (hasIntersection) {
          schedule.offset = (item.offset || 0) + 1;
        }
      }
      // add the new schedules to array to check the next one against it
      newSchedules.push(schedule);
    }
    return newSchedules;
  }, [schedules, hours]);

  const renderHoursContainers = useMemo(() => {
    return hoursContainers.map((hour, index) => {
      if (index === 0) {
        return (
          <ColumnCell
            key={`schedule-item-${hour}`}
            startHour={null}
            endHour={hour}
            disabled={column.disabled}
            onAddSchedule={handleAddSchedule}
          />
        );
      } else if (index + 1 === hoursContainers.length) {
        return (
          <ColumnCell
            key={`${hoursContainers[index]}-schedule-item`}
            startHour={hoursContainers[index]}
            endHour={null}
            disabled={column.disabled}
            onAddSchedule={handleAddSchedule}
          />
        );
      } else {
        return (
          <ColumnCell
            key={`${hoursContainers[index - 1]}-schedule-item-${hour}`}
            startHour={hoursContainers[index - 1]}
            endHour={hour}
            disabled={column.disabled}
            onAddSchedule={handleAddSchedule}
          />
        );
      }
    })
  }, [hoursContainers]);

  return (
    <div className={styles.columnRoot}>
      {renderHoursContainers}
      {schedulesWithOffset.map((schedule, index) => (
        <Schedule
          key={schedule.id}
          schedule={schedule}
          index={index}
          firstHour={hours[0]}
          viewDate={viewDate}
          onScheduleSelect={onScheduleSelected}
        />
      ))}
    </div>
  )
};

export default Column

Column.propTypes = {
  disabled: PropTypes.bool,
  viewDate: PropTypes.instanceOf(Date),
  hours: PropTypes.arrayOf(PropTypes.string),
  column: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    disabled: PropTypes.bool,
  }),
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
    })
  ),
  onAddSchedule: PropTypes.func,
  onScheduleSelected: PropTypes.func,
};

Column.defaultProps = {
  hours: [],
  schedules: [],
  onAddSchedule: () => null,
}
