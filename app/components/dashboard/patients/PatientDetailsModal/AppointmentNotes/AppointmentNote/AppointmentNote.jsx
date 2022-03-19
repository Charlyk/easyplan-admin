import React from 'react';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import IconEditService from 'app/components/icons/iconEditService';
import { textForKey } from 'app/utils/localization';
import styles from './AppointmentNote.module.scss';

const AppointmentNote = ({ visit, canEdit, onEdit }) => {
  const { doctor } = visit;

  const serviceName = (planService) => {
    let name = planService.name;
    if (planService.tooth != null) {
      name = `${name} | ${textForKey('tooth', planService.tooth)}`;
    }

    if (planService.bracesPlanType) {
      name = `${name} | ${textForKey(planService.bracesPlanType)}`;
    }
    return name;
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
        <Typography noWrap className={styles.noteText}>
          {visit.note?.length === 0 ? textForKey('no_notes') : visit.note}
        </Typography>
        <div className={styles.servicesContainer}>
          {visit?.treatmentServices?.map((planService, index) => (
            <div
              key={`${planService.id}-${index}`}
              className={styles.visitServiceItem}
              style={{ borderColor: planService.color }}
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
