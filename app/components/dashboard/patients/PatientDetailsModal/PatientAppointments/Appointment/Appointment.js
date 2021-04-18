import React from 'react';

import { Box, Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../../../../components/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../../../../components/icons/iconAppointmentClock';
import { Statuses } from '../../../../../../../utils/constants';
import { textForKey } from '../../../../../../../utils/localization';
import { baseApiUrl } from "../../../../../../../eas.config";
import styles from './Appointment.module.scss';

const Appointment = ({ appointment }) => {
  const scheduleData = moment(appointment.startTime);
  const status = Statuses.find(
    (item) => item.id === appointment.scheduleStatus,
  );
  return (
    <div className={styles.appointment}>
      <div className={styles['appointment-info']}>
        <div className={styles['appointment-info-row']}>
          <div className={styles['appointment-info-title']}>{textForKey('Doctor')}:</div>
          <div>{appointment.doctor.fullName}</div>
        </div>
        <div className={styles['appointment-info-row']}>
          <div className={styles['appointment-info-title']}>
            {textForKey('Services')}:
          </div>
          <div>{appointment.serviceName}</div>
        </div>
        <div className={styles['appointment-info-row']}>
          <div className={styles['appointment-info-title']}>{textForKey('Clinic')}:</div>
          <div>{appointment.clinic.name}</div>
        </div>
      </div>
      <div className={styles['appointment-time']}>
        <div className={styles['appointment-time-row']}>
          <IconAppointmentCalendar />
          <div className={styles['appointment-time-text']}>
            {scheduleData.format('DD MMM YYYY')}
          </div>
        </div>
        <div className={styles['appointment-time-row']}>
          <IconAppointmentClock />
          <div className={styles['appointment-time-text']}>
            {scheduleData.format('HH:mm')}
          </div>
        </div>
      </div>
      <Box
        display='flex'
        flexDirection='column'
        width='20%'
        alignItems='center'
      >
        <div
          className={styles['appointment-status-indicator']}
          style={{ backgroundColor: `${status.color}1A` }}
        >
          <Typography
            classes={{ root: styles['status-name-label'] }}
            style={{ color: status.color }}
          >
            {status?.name}
          </Typography>
        </div>
        {(status?.id === 'CompletedPaid' || status?.id === 'PartialPaid') && (
          <a
            href={`${baseApiUrl}/invoices/receipt/${appointment.id}?mode=schedule`}
            target='_blank'
            rel='noreferrer'
          >
            <span className={styles['print-label']}>{textForKey('Print receipt')}</span>
          </a>
        )}
        <Typography classes={{ root: styles['canceled-reason-label'] }}>
          {appointment.canceledReason}
        </Typography>
      </Box>
    </div>
  );
};

export default Appointment;

Appointment.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    doctor: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    clinic: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    startTime: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    dateAndTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
    canceledReason: PropTypes.string,
  }),
};
