import React, { useRef, useState } from 'react';

import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Statuses } from '../../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';

const offsetDistance = 20;
const minScheduleHeight = 30;
const entireMinHeight = 100;

const DayViewSchedule = ({
  schedule,
  index,
  viewDate,
  firstHour,
  onScheduleSelect,
}) => {
  const highlightTimeout = useRef(-1);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const startTime = moment(schedule.startTime);
  const endTime = moment(schedule.endTime);
  const startHour = startTime.format('HH:mm');
  const endHour = endTime.format('HH:mm');
  const scheduleStatus = Statuses.find(
    item => item.id === schedule.scheduleStatus,
  );
  const shouldAnimate = scheduleStatus.id === 'WaitingForPatient';

  const getScheduleHeight = () => {
    const startTime = moment(schedule.startTime);
    const endTime = moment(schedule.endTime);
    const scheduleDuration = moment
      .duration(endTime.diff(startTime))
      .asMinutes();
    const height = scheduleDuration * 2;
    if (height < entireMinHeight) {
      return isHighlighted ? entireMinHeight : height;
    }
    return height;
  };

  const getTopPosition = () => {
    const startTime = moment(schedule.startTime);
    const firstHourComps = firstHour.split(':');
    const clinicStartTime = moment(viewDate).set({
      hour: parseInt(firstHourComps[0]),
      minute: parseInt(firstHourComps[1]),
      second: 0,
    });
    const scheduleDayDuration = moment
      .duration(startTime.diff(clinicStartTime))
      .asMinutes();
    const newTop = scheduleDayDuration * 2 + minScheduleHeight;
    return newTop;
  };

  const handleScheduleClick = () => {
    onScheduleSelect(schedule);
  };

  const handlePointerEnter = () => {
    highlightTimeout.current = setTimeout(() => {
      setIsHighlighted(true);
    }, 400);
  };

  const handlePointerLeave = () => {
    clearTimeout(highlightTimeout.current);
    setIsHighlighted(false);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={clsx(
        'day-view-schedule',
        shouldAnimate && 'upcoming',
        schedule.isUrgent && 'urgent',
      )}
      onClick={handleScheduleClick}
      style={{
        left: `calc(${schedule.offset} * ${offsetDistance}px)`,
        width: `calc(99.5% - ${schedule.offset} * ${offsetDistance}px)`,
        top: getTopPosition(),
        zIndex: isHighlighted ? 2000 : 100 + index,
        height: getScheduleHeight(),
      }}
    >
      <div
        className='day-view-schedule__status-indicator'
        style={{ backgroundColor: scheduleStatus.color }}
      />
      <div className='day-view-schedule__wrapper'>
        <div className='header'>
          <Typography noWrap classes={{ root: 'hour-label' }}>
            {startHour} - {endHour} {schedule.patient.fullName}
          </Typography>
          {scheduleStatus.statusIcon != null && (
            <div
              className={clsx(
                'status-icon',
                (scheduleStatus.id === 'DidNotCome' ||
                  scheduleStatus.id === 'Canceled') &&
                  'negative',
              )}
            >
              {scheduleStatus.statusIcon}
            </div>
          )}
        </div>
        <div className='info'>
          <div className='info-wrapper'>
            <div className='info-row'>
              <Typography classes={{ root: 'info-title' }}>
                {textForKey('Service')}:
              </Typography>
              <Typography noWrap classes={{ root: 'info-label' }}>
                {schedule.serviceName}
              </Typography>
            </div>
            <div className='info-row'>
              <Typography classes={{ root: 'info-title' }}>
                {textForKey('Patient')}:
              </Typography>
              <Typography noWrap classes={{ root: 'info-label' }}>
                {schedule.patient.fullName}
              </Typography>
            </div>
            <div className='info-row'>
              <Typography classes={{ root: 'info-title' }}>
                {textForKey('Status')}:
              </Typography>
              <Typography noWrap classes={{ root: 'info-label' }}>
                {scheduleStatus.name}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayViewSchedule;

DayViewSchedule.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceName: PropTypes.string,
    isUrgent: PropTypes.bool,
    offset: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
  }).isRequired,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  parentTop: PropTypes.number,
  index: PropTypes.number,
  onScheduleSelect: PropTypes.func,
  firstHour: PropTypes.string,
  viewDate: PropTypes.instanceOf(Date),
};

DayViewSchedule.defaultProps = {
  startHour: '12:00',
  endHour: '13:30',
  parentTop: 0,
  index: 0,
  onScheduleSelect: () => null,
};
