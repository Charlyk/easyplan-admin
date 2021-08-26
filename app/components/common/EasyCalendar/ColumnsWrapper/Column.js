import React from "react";
import PropTypes from 'prop-types';
import Moment from "moment-timezone";
import { extendMoment } from "moment-range";
import createContainerHours from "../../../../utils/createContainerHours";
import Schedule from "../Schedule/Schedule";
import ColumnCell from "./ColumnCell";
import styles from './ColumnsWrapper.module.scss';

const moment = extendMoment(Moment);

const Column = (
  {
    schedules,
    hours,
    column,
    animatedStatuses,
    isSingleMode,
    hideCreateIndicator,
    onAddSchedule,
    onScheduleSelected
  }
) => {
  const hoursContainers = createContainerHours(hours);

  function handleAddSchedule(startHour, endHour) {
    onAddSchedule(startHour, endHour, column.doctorId, column.date);
  }

  function schedulesWithOffset() {
    const newSchedules = [];
    // check if schedules intersect other schedules and update their offset
    for (let schedule of schedules) {
      const scheduleRange = moment.range(
        moment(schedule.startTime),
        moment(schedule.endTime),
      );
      let offset = 0;
      // update new schedule offset based on already added schedules
      for (let item of newSchedules) {
        const itemRange = moment.range(
          moment(item.startTime),
          moment(item.endTime),
        );
        const hasIntersection = scheduleRange.intersect(itemRange) != null;
        if (hasIntersection) {
          offset = (item.offset || 0) + 1;
        }
      }
      // add the new schedules to array to check the next one against it
      newSchedules.push({ ...schedule, offset });
    }
    return newSchedules;
  }

  function renderHoursContainers() {
    return hoursContainers.map((hour, index) => {
      if (index === 0) {
        return (
          <ColumnCell
            key={`schedule-item-${hour}`}
            hideCreateIndicator={hideCreateIndicator}
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
            hideCreateIndicator={hideCreateIndicator}
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
            hideCreateIndicator={hideCreateIndicator}
            startHour={hoursContainers[index - 1]}
            endHour={hour}
            disabled={column.disabled}
            onAddSchedule={handleAddSchedule}
          />
        );
      }
    })
  }

  return (
    <div className={styles.columnRoot}>
      {renderHoursContainers()}
      {schedulesWithOffset().map((schedule, index) => (
        <Schedule
          key={schedule.id}
          schedule={schedule}
          animatedStatuses={animatedStatuses}
          index={index}
          firstHour={hours[0]}
          onScheduleSelect={onScheduleSelected}
        />
      ))}
    </div>
  )
};

export default Column

Column.propTypes = {
  disabled: PropTypes.bool,
  hideCreateIndicator: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  isSingleMode: PropTypes.bool,
  column: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    doctorId: PropTypes.number,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
  }),
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
    })
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
};

Column.defaultProps = {
  hours: [],
  schedules: [],
  onAddSchedule: () => null,
}
