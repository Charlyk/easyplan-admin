import React, { useCallback, useLayoutEffect, useMemo } from 'react';

import clsx from 'clsx';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

import DayViewSchedule from './DayViewSchedule';
import ScheduleItemContainer from './ScheduleItemContainer';

const DoctorColumn = ({
  doctor,
  schedules,
  parentTop,
  viewDate,
  index,
  firstHour,
  hoursContainers,
  onScheduleClick,
  onAddSchedule,
  onItemRendered,
}) => {
  const doctorRect = document
    .getElementById(String(doctor.id))
    ?.getBoundingClientRect() || { width: 0 };

  const getHoursHeight = () => {
    const element = document.getElementById('day-hours-container');
    const rect = element?.getBoundingClientRect() || { height: 0 };
    return rect.height;
  };

  useLayoutEffect(() => {
    debounceItemRendered();
  });

  const triggerColumnRendered = () => {
    onItemRendered(index);
  };

  const debounceItemRendered = useCallback(
    debounce(triggerColumnRendered, 200),
    [],
  );

  const renderHoursContainers = hoursContainers.map((hour, index) => {
    if (index === 0) {
      return (
        <ScheduleItemContainer
          disabled={doctor.isInVacation}
          onAddSchedule={onAddSchedule(doctor)}
          startHour={null}
          endHour={hour}
          key={`schedule-item-${hour}`}
          className='day-schedule-item-container'
        />
      );
    } else if (index + 1 === hoursContainers.length) {
      return (
        <ScheduleItemContainer
          disabled={doctor.isInVacation}
          onAddSchedule={onAddSchedule(doctor)}
          startHour={hoursContainers[index]}
          endHour={null}
          key={`${hoursContainers[index]}-schedule-item`}
          className='day-schedule-item-container'
        />
      );
    } else {
      return (
        <ScheduleItemContainer
          disabled={doctor.isInVacation}
          onAddSchedule={onAddSchedule(doctor)}
          startHour={hoursContainers[index - 1]}
          endHour={hour}
          key={`${hoursContainers[index - 1]}-schedule-item-${hour}`}
          className='day-schedule-item-container'
        />
      );
    }
  });

  const memoizedHoursContainer = useMemo(() => renderHoursContainers, [
    hoursContainers,
  ]);

  return (
    <div
      id={`${doctor.id}&column`}
      key={`${doctor.id}-column`}
      style={{ width: doctorRect.width, height: getHoursHeight() }}
      className={clsx(
        'day-schedules-column',
        doctor.isInVacation && 'disabled',
      )}
    >
      {schedules?.map((schedule, index) => (
        <DayViewSchedule
          key={schedule.id}
          parentTop={parentTop}
          schedule={schedule}
          index={index}
          viewDate={viewDate}
          onScheduleSelect={onScheduleClick}
          offset={0}
          firstHour={firstHour}
        />
      ))}
      {memoizedHoursContainer}
    </div>
  );
};

export default React.memo(DoctorColumn);

DoctorColumn.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number,
    isInVacation: PropTypes.bool,
  }),
  hoursContainers: PropTypes.arrayOf(PropTypes.string),
  firstHour: PropTypes.string,
  parentTop: PropTypes.number,
  viewDate: PropTypes.instanceOf(Date),
  schedules: PropTypes.arrayOf(PropTypes.object),
  onScheduleClick: PropTypes.func,
  onAddSchedule: PropTypes.func,
  onItemRendered: PropTypes.func,
  index: PropTypes.number,
};

DoctorColumn.defaultProps = {
  schedules: [],
  hoursContainers: [],
  onItemRendered: () => null,
  index: 0,
};
