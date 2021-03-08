import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Box, Typography } from '@material-ui/core';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import { Statuses } from '../../../../../../utils/constants';
import { textForKey } from '../../../../../../utils/localization';
import styles from './DayViewSchedule.module.scss';

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
  const isPause = schedule.type === 'Pause';
  const highlightTimeout = useRef(-1);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const startTime = moment(schedule.startTime);
  const endTime = moment(schedule.endTime);
  const startHour = startTime.format('HH:mm');
  const endHour = endTime.format('HH:mm');
  const scheduleStatus = Statuses.find(
    (item) => item.id === schedule.scheduleStatus,
  );
  const shouldAnimate = scheduleStatus?.id === 'WaitingForPatient';

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

  const topPosition = useMemo(() => {
    if (firstHour == null) {
      return 0
    }
    const startTime = moment(schedule.startTime);
    const [hours, minutes] = firstHour.split(':');
    const clinicStartTime = moment(viewDate).set({
      hour: parseInt(hours),
      minute: parseInt(minutes),
      second: 0,
    });
    const scheduleDayDuration = moment
      .duration(startTime.diff(clinicStartTime))
      .asMinutes();
    const newTop = scheduleDayDuration * 2 + minScheduleHeight;
    return Math.abs(newTop);
  }, [firstHour, schedule]);

  const handleScheduleClick = () => {
    onScheduleSelect(schedule);
  };

  const handlePointerEnter = () => {
    highlightTimeout.current = setTimeout(() => {
      setIsHighlighted(true);
    }, 300);
  };

  const handlePointerLeave = () => {
    clearTimeout(highlightTimeout.current);
    setIsHighlighted(false);
  };

  const height = getScheduleHeight();
  const itemRect = { height, top: topPosition }

  return (
    <div
      role='button'
      tabIndex={0}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={clsx(
        styles['day-view-schedule'],
        shouldAnimate && styles.upcoming,
        schedule.isUrgent && styles.urgent,
      )}
      onClick={handleScheduleClick}
      style={{
        left: isHighlighted
          ? 0
          : `calc(${schedule.offset} * ${offsetDistance}px)`,
        width: isHighlighted
          ? '99.5%'
          : `calc(99.5% - ${schedule.offset} * ${offsetDistance}px)`,
        top: itemRect.top,
        zIndex: isHighlighted ? 500 : 100 + index,
        height: itemRect.height,
        backgroundColor: isPause ? '#FDC534' : '#f3f3f3',
        border: isHighlighted && !isPause ? '#3A83DC 1px solid' : 'none',
      }}
    >
      <span
        className={styles['day-view-schedule__status-indicator']}
        style={{ backgroundColor: scheduleStatus?.color || 'white' }}
      />
      <Box className={styles['day-view-schedule__wrapper']}>
        <Box className={styles['header']}>
          {schedule.type === 'Schedule' && (
            <Typography noWrap classes={{ root: styles['patient-name-label'] }}>
              {schedule.patient.fullName}
            </Typography>
          )}
          <Box display='flex' alignItems='center'>
            <Typography
              noWrap
              classes={{ root: clsx(styles['hour-label'], isPause && styles.pause) }}
            >
              {startHour} - {endHour}
            </Typography>
            {scheduleStatus?.statusIcon != null && (
              <span
                className={clsx(
                  styles['status-icon'],
                  (scheduleStatus?.id === 'DidNotCome' ||
                    scheduleStatus?.id === 'Canceled') &&
                    styles.negative,
                )}
              >
                {scheduleStatus?.statusIcon}
              </span>
            )}
          </Box>
        </Box>
        <Box className={styles['info']}>
          {schedule.type === 'Schedule' ? (
            <Box className={styles['info-wrapper']}>
              <div className={styles['info-row']}>
                <Typography classes={{ root: styles['info-title'] }}>
                  {textForKey('Service')}:
                </Typography>
                <Typography noWrap classes={{ root: styles['info-label'] }}>
                  {schedule.serviceName}
                </Typography>
              </div>
              <div className={styles['info-row']}>
                <Typography classes={{ root: styles['info-title'] }}>
                  {textForKey('Patient')}:
                </Typography>
                <Typography noWrap classes={{ root: styles['info-label'] }}>
                  {schedule.patient.fullName}
                </Typography>
              </div>
              <div className={styles['info-row']}>
                <Typography classes={{ root: styles['info-title'] }}>
                  {textForKey('Status')}:
                </Typography>
                <Typography noWrap classes={{ root: styles['info-label'] }}>
                  {scheduleStatus?.name}
                </Typography>
              </div>
            </Box>
          ) : (
            <div className={styles['pause-wrapper']}>
              <Typography classes={{ root: styles['pause-label'] }}>
                {textForKey('Pause')}
              </Typography>
              <Typography classes={{ root: styles['comment-label'] }}>
                {schedule.comment}
              </Typography>
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default React.memo(DayViewSchedule, (prevProps, nextProps) => {
  return (
    isEqual(prevProps.schedule, nextProps.schedule) &&
    isEqual(prevProps.viewDate, nextProps.viewDate)
  );
});

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
    type: PropTypes.oneOf(['Schedule', 'Pause']),
    comment: PropTypes.string,
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
