import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import Moment from "moment-timezone";
import { extendMoment } from "moment-range";
import { useSelector } from "react-redux";
import {
  deleteScheduleSelector,
  updateScheduleSelector
} from "../../../../../redux/selectors/scheduleSelector";
import createContainerHours from "../../../../utils/createContainerHours";
import Schedule from "../Schedule/Schedule";
import ColumnCell from "./ColumnCell";
import styles from './ColumnsWrapper.module.scss';

const moment = extendMoment(Moment);

const Column = (
  {
    schedules: initialSchedules,
    hours,
    column,
    animatedStatuses,
    hideCreateIndicator,
    onAddSchedule,
    onScheduleSelected
  }
) => {
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const [schedules, setSchedules] = useState(initialSchedules);

  useEffect(() => {
    setSchedules(initialSchedules);
  }, [])

  useEffect(() => {
    if (updateSchedule == null) {
      return;
    }

    const scheduleExists = schedules.some(item => item.id === updateSchedule.id);
    if (scheduleExists) {
      // schedule exists so we need to update it
      const newSchedules = schedules.map((item) => {
        if (item.id !== updateSchedule.id) {
          return item;
        }
        return { ...item, ...updateSchedule }
      });
      setSchedules(newSchedules);
    } else {
      // schedule does not exist in this column so we need to add it
      const scheduleDate = moment(updateSchedule.startTime);
      const currentDate = moment(column.date);
      if (!scheduleDate.isSame(currentDate, 'date')) {
        // schedule date is not the same as column date
        return;
      }
      const newSchedules = [...schedules, updateSchedule];
      setSchedules(orderBy(newSchedules, ['startTime', 'asc']));
    }
  }, [updateSchedule]);

  useEffect(() => {
    if (deleteSchedule == null) {
      return;
    }
    const newSchedules = schedules.filter((item) => item.id !== deleteSchedule.id);
    setSchedules(newSchedules);
  }, [deleteSchedule]);

  const hoursContainers = useMemo(() => {
    return createContainerHours(hours);
  }, [hours]);

  const handleAddSchedule = (startHour, endHour) => {
    onAddSchedule(startHour, endHour, column.doctorId, column.date);
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
  }, [hoursContainers, hideCreateIndicator, column]);

  return (
    <div className={styles.columnRoot}>
      {renderHoursContainers}
      {schedulesWithOffset.map((schedule, index) => (
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
