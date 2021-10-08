import React, { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';

import { Statuses } from '../../../../utils/constants';
import { textForKey } from '../../../../utils/localization';
import styles from './Schedule.module.scss';
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";

const offsetDistance = 20;
const minScheduleHeight = 32;
const entireMinHeight = 100;

const Schedule = (
  {
    schedule,
    index,
    firstHour,
    animatedStatuses,
    onScheduleSelect,
  }
) => {
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
  const shouldAnimate = animatedStatuses.includes(scheduleStatus?.id);

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
    const clinicStartTime = moment(schedule.startTime).set({
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
        styles.dayViewSchedule,
        {
          [styles.upcoming]: shouldAnimate,
          [styles.urgent]: schedule.isUrgent || schedule.urgent,
        },
      )}
      onClick={handleScheduleClick}
      style={{
        left: isHighlighted
          ? 0
          : `calc(${schedule.offset} * ${offsetDistance}px)`,
        width: isHighlighted
          ? '100%'
          : `calc(100% - ${schedule.offset} * ${offsetDistance}px)`,
        top: itemRect.top,
        zIndex: isHighlighted ? 500 : 100 + index,
        height: itemRect.height,
        backgroundColor: isPause ? '#FDC534' : '#f3f3f3',
        border: isHighlighted && !isPause ? '#3A83DC 1px solid' : 'none',
      }}
    >
      <span
        className={styles.statusIndicator}
        style={{ backgroundColor: scheduleStatus?.color || 'white' }}
      />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          {schedule.type === 'Schedule' && (
            <Typography noWrap classes={{ root: styles.patientNameLabel }}>
              {schedule.patient.fullName}
            </Typography>
          )}
          <div className='flexContainer'>
            <Typography
              noWrap
              classes={{ root: clsx(styles.hourLabel, isPause && styles.pause) }}
            >
              {startHour} - {endHour}
            </Typography>
            {scheduleStatus?.id === 'Late' && schedule.delayTime > 0 && (
              <Typography
                noWrap
                style={{ marginLeft: 3 }}
                classes={{ root: clsx(styles.hourLabel, isPause && styles.pause) }}
              >
                (+{schedule.delayTime} min)
              </Typography>
            )}
            {scheduleStatus?.statusIcon != null && (
              <span
                className={clsx(
                  styles.statusIcon,
                  (scheduleStatus?.id === 'DidNotCome' ||
                    scheduleStatus?.id === 'Canceled') &&
                  styles.negative,
                )}
              >
                {scheduleStatus?.statusIcon}
              </span>
            )}
          </div>
        </div>
        <div className={styles.info}>
          {schedule.type === 'Schedule' ? (
            <div className={styles.infoWrapper}>
              <div className={styles.infoRow}>
                <Typography className={styles.infoTitle}>
                  {textForKey('Service')}:
                </Typography>
                <Typography noWrap className={styles.infoLabel}>
                  {schedule.serviceName}
                </Typography>
              </div>
              <div className={styles.infoRow}>
                <Typography className={styles.infoTitle}>
                  {textForKey('Patient')}:
                </Typography>
                <Typography noWrap className={styles.infoLabel}>
                  {schedule.patient.fullName}
                </Typography>
              </div>
              <div className={styles.infoRow}>
                <Typography className={styles.infoTitle}>
                  {textForKey('Status')}:
                </Typography>
                <Typography noWrap className={styles.infoLabel}>
                  {scheduleStatus?.name}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={styles.pauseWrapper}>
              <Typography className={styles.pauseLabel}>
                {textForKey('Pause')}
              </Typography>
              <Typography className={styles.commentLabel}>
                {schedule.comment}
              </Typography>
              <Typography className={styles.commentLabel}>
                {upperFirst(textForKey('Created by'))}: {schedule.createdByName}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Schedule, areComponentPropsEqual);

Schedule.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceName: PropTypes.string,
    createdByName: PropTypes.string,
    isUrgent: PropTypes.bool,
    urgent: PropTypes.bool,
    offset: PropTypes.number,
    type: PropTypes.oneOf(['Schedule', 'Pause']),
    comment: PropTypes.string,
    delayTime: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
  }).isRequired,
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
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  parentTop: PropTypes.number,
  index: PropTypes.number,
  onScheduleSelect: PropTypes.func,
  firstHour: PropTypes.string,
};

Schedule.defaultProps = {
  startHour: '12:00',
  endHour: '13:30',
  parentTop: 0,
  index: 0,
  onScheduleSelect: () => null,
};
