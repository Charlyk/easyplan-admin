import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import IconAppointmentCalendar from 'app/components/icons/iconAppointmentCalendar';
import IconAppointmentClock from 'app/components/icons/iconAppointmentClock';
import { Statuses } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { baseApiUrl } from 'eas.config';
import styles from './Appointment.module.scss';

const Appointment = ({ appointment }) => {
  const scheduleDate = moment(appointment.dateAndTime);
  const { service, clinic, doctor } = appointment;
  const status = Statuses.find((item) => item.id === appointment.status);
  return (
    <div className={styles.appointment}>
      <div className={styles.appointmentInfo}>
        <div className={styles.appointmentInfoRow}>
          <div className={styles.appointmentInfoTitle}>
            {textForKey('Doctor')}:
          </div>
          <div>{doctor.fullName}</div>
        </div>
        <div className={styles.appointmentInfoRow}>
          <div className={styles.appointmentInfoTitle}>
            {textForKey('Services')}:
          </div>
          <div>{service.name}</div>
        </div>
        <div className={styles.appointmentInfoRow}>
          <div className={styles.appointmentInfoTitle}>
            {textForKey('Clinic')}:
          </div>
          <div>{clinic.clinicName}</div>
        </div>
      </div>
      <div className={styles.appointmentTime}>
        <div className={styles.appointmentTimeRow}>
          <IconAppointmentCalendar />
          <div className={styles.appointmentTimeText}>
            {scheduleDate.format('DD MMM YYYY')}
          </div>
        </div>
        <div className={styles.appointmentTimeRow}>
          <IconAppointmentClock />
          <div className={styles.appointmentTimeText}>
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
          className={styles.appointmentStatusIndicator}
          style={{ backgroundColor: `${status.color}1A` }}
        >
          <Typography
            classes={{ root: styles.statusNameLabel }}
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
            <span className={styles.printLabel}>
              {textForKey('Print receipt')}
            </span>
          </a>
        )}
        <Typography classes={{ root: styles.canceledReasonLabel }}>
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
