import React, { useMemo, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { Statuses } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { clinicDoctorsSelector } from 'redux/selectors/appDataSelector';
import { dragItemTypes } from 'types';
import styles from './Schedule.module.scss';

const offsetDistance = 20;
const minScheduleHeight = 32;
const entireMinHeight = 100;

const Schedule = ({
  schedule,
  index,
  firstHour,
  animatedStatuses,
  onScheduleSelect,
}) => {
  const isPause = schedule.type === 'Pause';
  const highlightTimeout = useRef(-1);
  const clinicDoctors = useSelector(clinicDoctorsSelector);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const startTime = moment(schedule.startTime);
  const endTime = moment(schedule.endTime);
  const startHour = startTime.format('HH:mm');
  const endHour = endTime.format('HH:mm');
  const scheduleStatus = Statuses.find(
    (item) => item.id === schedule.scheduleStatus,
  );
  const shouldAnimate = animatedStatuses.includes(scheduleStatus?.id);
  const doctor = useMemo(() => {
    const item = clinicDoctors.find(
      (doctor) => doctor.id === schedule.doctorId,
    );
    if (item == null) return null;
    return item.fullName;
  }, [clinicDoctors, schedule]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: dragItemTypes.Schedule,
    item: schedule,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

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
      return 0;
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

  const getScheduleZIndex = () => {
    if (isHighlighted) {
      return 500;
    }
    if (!isHighlighted && isPause) {
      return 0;
    }
    if (!isHighlighted && !isPause) {
      return 100 + index;
    }
  };

  const height = getScheduleHeight();
  const itemRect = { height, top: topPosition };

  return (
    <Box
      ref={isPause ? null : drag}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={clsx(styles.dayViewSchedule, {
        [styles.upcoming]: shouldAnimate,
        [styles.urgent]: schedule.isUrgent || schedule.urgent,
        [styles.pauseStyles]: isPause,
      })}
      onClick={handleScheduleClick}
      style={{
        opacity: isDragging ? 0.6 : 1,
        left: isHighlighted
          ? 0
          : `calc(${schedule.offset} * ${offsetDistance}px)`,
        width: isHighlighted
          ? '100%'
          : `calc(100% - ${schedule.offset} * ${offsetDistance}px)`,
        top: itemRect.top,
        zIndex: getScheduleZIndex(),
        height: itemRect.height,
        backgroundColor: isPause ? '' : '#f3f3f3',
        border: isHighlighted && !isPause ? '#3A83DC 1px solid' : 'none',
      }}
    >
      {!isPause && (
        <span
          className={styles.statusIndicator}
          style={{ backgroundColor: scheduleStatus?.color || 'white' }}
        />
      )}
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
              classes={{
                root: clsx(styles.hourLabel, isPause && styles.pause),
              }}
            >
              {startHour} - {endHour}
            </Typography>
            {scheduleStatus?.id === 'Late' && schedule.delayTime > 0 && (
              <Typography
                noWrap
                style={{ marginLeft: 3 }}
                classes={{
                  root: clsx(styles.hourLabel, isPause && styles.pause),
                }}
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
            <table className={styles.infoWrapper}>
              <tbody>
                {doctor && (
                  <tr className={styles.infoRow}>
                    <td>
                      <Typography className={styles.infoTitle}>
                        {textForKey('Doctor')}:
                      </Typography>
                    </td>
                    <td>
                      <Typography noWrap className={styles.infoLabel}>
                        {doctor}
                      </Typography>
                    </td>
                  </tr>
                )}
                <tr className={styles.infoRow}>
                  <td>
                    <Typography className={styles.infoTitle}>
                      {textForKey('Service')}:
                    </Typography>
                  </td>
                  <td>
                    <Typography noWrap className={styles.infoLabel}>
                      {schedule.serviceName}
                    </Typography>
                  </td>
                </tr>
                <tr className={styles.infoRow}>
                  <td>
                    <Typography className={styles.infoTitle}>
                      {textForKey('Patient')}:
                    </Typography>
                  </td>
                  <td>
                    <Typography noWrap className={styles.infoLabel}>
                      {schedule.patient.fullName}
                    </Typography>
                  </td>
                </tr>
                <tr className={styles.infoRow}>
                  <td>
                    <Typography className={styles.infoTitle}>
                      {textForKey('Status')}:
                    </Typography>
                  </td>
                  <td>
                    <Typography noWrap className={styles.infoLabel}>
                      {scheduleStatus?.name}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
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
    </Box>
  );
};

export default React.memo(Schedule, areComponentPropsEqual);

Schedule.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number,
    startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    ]),
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
