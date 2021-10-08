import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Statuses } from '../../../../../utils/constants';
import styles from './ScheduleItem.module.scss';

const ScheduleItem = ({ appointment, hidden, showHour, onSelect }) => {
  const shouldAnimate = appointment.scheduleStatus === 'WaitingForPatient';

  const handleScheduleClick = () => {
    if (hidden) {
      return;
    }
    onSelect(appointment);
  };

  const scheduleStatus = Statuses.find(
    (item) => item.id === appointment.scheduleStatus,
  );

  const startTime = moment(appointment.startTime);
  const endTime = moment(appointment.endTime);

  return (
    <div
      role='button'
      tabIndex={0}
      id={`${appointment.id}-${startTime.format('HH:mm')}>${endTime.format(
        'HH:mm',
      )}`}
      key={appointment.id}
      className={clsx(
        styles.scheduleItem,
        shouldAnimate && styles.upcoming,
        appointment.isUrgent && styles.urgent,
      )}
      onClick={handleScheduleClick}
      style={{ backgroundColor: `${scheduleStatus.color}47` }}
    >
      <div
        className={styles.serviceIndicator}
        style={{ backgroundColor: appointment.serviceColor }}
      />
      <div className={styles.nameAndStatus}>
        <Typography noWrap classes={{ root: styles.patientName }}>
          {appointment.patient.fullName}
        </Typography>
        {scheduleStatus.statusIcon != null && (
          <div
            className={clsx(
              styles.statusIcon,
              (scheduleStatus.id === 'DidNotCome' ||
                scheduleStatus.id === 'Canceled') &&
              styles.negative,
            )}
          >
            {scheduleStatus.statusIcon}
          </div>
        )}
      </div>
      {showHour && (
        <Typography noWrap classes={{ root: styles.scheduleTime }}>
          {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
        </Typography>
      )}
    </div>
  );
};

ScheduleItem.propTypes = {
  hidden: PropTypes.bool,
  showHour: PropTypes.bool,
  onSelect: PropTypes.func,
  appointment: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    startTime: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    endTime: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    scheduleStatus: PropTypes.string,
    isUrgent: PropTypes.bool,
  }),
};

ScheduleItem.defaultProps = {
  onSelect: () => null,
  showHour: true,
};

export default ScheduleItem;
