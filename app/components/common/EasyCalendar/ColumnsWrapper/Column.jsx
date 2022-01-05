import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import PropTypes from 'prop-types';
import IconUmbrella from 'app/components/icons/iconUmbrella';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import createContainerHours from 'app/utils/createContainerHours';
import { textForKey } from 'app/utils/localization';
import Schedule from '../Schedule';
import ColumnCell from './ColumnCell';
import styles from './ColumnsWrapper.module.scss';

const moment = extendMoment(Moment);
const maxOffset = 6;

const Column = ({
  schedules,
  hours,
  column,
  animatedStatuses,
  hideCreateIndicator,
  onAddSchedule,
  onScheduleSelected,
}) => {
  const hoursContainers = createContainerHours(hours);

  const handleAddSchedule = (startHour, endHour) => {
    onAddSchedule(startHour, endHour, column.doctorId, column.date, column.id);
  };

  const [filteredSchedules, filteredPauses] = useMemo(() => {
    const filteredSchedules = [];
    const filteredPauses = [];
    for (const schedule of schedules) {
      if (schedule.type === 'Schedule') {
        filteredSchedules.push(schedule);
      } else if (schedule.type === 'Pause') {
        filteredPauses.push(schedule);
      }
    }
    return [filteredSchedules, filteredPauses];
  }, [schedules]);

  const schedulesWithOffset = useMemo(() => {
    const newSchedules = [];
    // check if schedules intersect other schedules and update their offset
    for (let schedule of filteredSchedules) {
      const scheduleRange = moment.range(
        moment(schedule.startTime),
        moment(schedule.endTime),
      );
      let offset = 0;
      // update new schedule offset based on already added schedules
      if (schedule.type !== 'Pause') {
        for (let item of newSchedules) {
          const itemRange = moment.range(
            moment(item.startTime),
            moment(item.endTime),
          );
          const hasIntersection = scheduleRange.intersect(itemRange) != null;
          if (hasIntersection) {
            offset = (item.offset || 0) + 1;
          }
          if (offset > maxOffset) {
            offset = 0;
          }
        }
      }
      // add the new schedules to array to check the next one against it
      if (!newSchedules.some((item) => item.id === schedule.id)) {
        newSchedules.push({ ...schedule, offset });
      }
    }
    return newSchedules;
  }, [schedules, column]);

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
    });
  }

  return (
    <div
      className={clsx(styles.columnRoot, {
        [styles.disabled]: column.disabled,
      })}
    >
      {column.disabled && (
        <div className={styles.disabledWrapper}>
          <IconUmbrella />
          <Typography className={styles.disabledLabel}>
            {textForKey('doctor_vacation_message')}
          </Typography>
        </div>
      )}
      {renderHoursContainers()}
      {filteredPauses.map((schedule, index) => (
        <Schedule
          key={schedule.id}
          schedule={schedule}
          animatedStatuses={animatedStatuses}
          index={index}
          firstHour={hours[0]}
          onScheduleSelect={onScheduleSelected}
        />
      ))}
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
  );
};

export default React.memo(Column, areComponentPropsEqual);

Column.propTypes = {
  disabled: PropTypes.bool,
  viewDate: PropTypes.instanceOf(Date),
  hideCreateIndicator: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  isSingleMode: PropTypes.bool,
  column: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    doctorId: PropTypes.number,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
    hint: PropTypes.string,
  }),
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      comment: PropTypes.string,
      doctorId: PropTypes.number,
      startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    ]),
  ),
  onAddSchedule: PropTypes.func,
  onScheduleSelected: PropTypes.func,
};

Column.defaultProps = {
  hours: [],
  schedules: [],
  onAddSchedule: () => null,
};
