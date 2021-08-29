import React from 'react';

import { Box, Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../../icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../../icons/iconAppointmentClock';
import { Statuses } from '../../../../../../utils/constants';
import { textForKey } from '../../../../../../../utils/localization';
import { baseApiUrl } from "../../../../../../../eas.config";
import styles from './Appointment.module.scss';

const Appointment = ({ appointment }) => {
  const scheduleDate = moment(appointment.dateAndTime);
  const { service, clinic, doctor } = appointment;
  const status = Statuses.find(
    (item) => item.id === appointment.status,
  );
  return (
    <div className={styles.appointment}>
      <div className={styles['appointment-info']}>
        <div className={styles['appointment-info-row']}>
          <div className={styles['appointment-info-title']}>{textForKey('Doctor')}:</div>
          <div>{doctor.fullName}</div>
        </div>
        <div className={styles['appointment-info-row']}>
          <div className={styles['appointment-info-title']}>
            {textForKey('Services')}:
          </div>
          <div>{service.name}</div>
        </div>
        <div className={styles['appointment-info-row']}>
          <div className={styles['appointment-info-title']}>{textForKey('Clinic')}:</div>
          <div>{clinic.clinicName}</div>
        </div>
      </div>
      <div className={styles['appointment-time']}>
        <div className={styles['appointment-time-row']}>
          <IconAppointmentCalendar />
          <div className={styles['appointment-time-text']}>
            {scheduleDate.format('DD MMM YYYY')}
          </div>
        </div>
        <div className={styles['appointment-time-row']}>
          <IconAppointmentClock />
          <div className={styles['appointment-time-text']}>
            {scheduleDate.format('HH:mm')}
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
      clinicName: PropTypes.string,
    }),
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    dateAndTime: PropTypes.string,
    status: PropTypes.string,
    canceledReason: PropTypes.string,
  }),
};
