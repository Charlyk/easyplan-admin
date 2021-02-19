import React from 'react';

import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import { Statuses } from '../../../../utils/constants';

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
        'schedule-item',
        shouldAnimate && 'upcoming',
        appointment.isUrgent && 'urgent',
      )}
      onClick={handleScheduleClick}
      style={{ backgroundColor: `${scheduleStatus.color}47` }}
    >
      <div
        className='service-indicator'
        style={{ backgroundColor: appointment.serviceColor }}
      />
      <div className='name-and-status'>
        <Typography noWrap classes={{ root: 'patient-name' }}>
          {appointment.patient.fullName}
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
      {showHour && (
        <Typography noWrap classes={{ root: 'schedule-time' }}>
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
    startTime: PropTypes.object,
    endTime: PropTypes.object,
    scheduleStatus: PropTypes.string,
    isUrgent: PropTypes.bool,
  }),
};

ScheduleItem.defaultProps = {
  onSelect: () => null,
  showHour: true,
};

export default ScheduleItem;
