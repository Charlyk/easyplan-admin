import React from 'react';
import Box from '@material-ui/core/Box';
import IconEditService from 'app/icons/iconEditService';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import getServiceName from 'app/utils/getServiceName';
import { textForKey } from 'app/utils/localization';
import styles from './AppointmentNote.module.scss';

const AppointmentNote = ({ visit, canEdit, onEdit }) => {
  const { doctor } = visit;

  const serviceName = (planService) => {
    return getServiceName({ ...planService, name: planService.service.name });
  };

  return (
    <div className={styles.appointmentNote}>
      <div className={styles.noteDate}>
        {moment(visit.created).format('DD MMM YYYY HH:mm')}
      </div>
      <div className={styles.dataWrapper}>
        <div className={styles.creatorInfo}>
          <span className={styles.doctorTitle}>{textForKey('Doctor')}:</span>
          <span className={styles.doctorName}>{doctor.fullName}</span>
        </div>
        <div className={styles.noteText}>
          {visit.note.length === 0 ? textForKey('No notes') : visit.note}
        </div>
        <div className={styles.servicesContainer}>
          {visit?.planServices?.map((planService, index) => (
            <div
              key={`${planService.id}-${index}`}
              className={styles.visitServiceItem}
            >
              {serviceName(planService)}
            </div>
          ))}
        </div>
        {canEdit && (
          <Box className={styles.editNoteBtn} onClick={() => onEdit(visit)}>
            <IconEditService />
          </Box>
        )}
      </div>
    </div>
  );
};

export default AppointmentNote;

AppointmentNote.propTypes = {
  canEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  visit: PropTypes.shape({
    id: PropTypes.number,
    note: PropTypes.string,
    doctor: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    created: PropTypes.string,
    planServices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        toothId: PropTypes.string,
        destination: PropTypes.string,
        service: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          color: PropTypes.string,
          price: PropTypes.number,
          currency: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
};
