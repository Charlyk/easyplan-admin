import React from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import IconEditService from '../../../../../components/icons/iconEditService';
import { textForKey } from '../../../../../utils/localization';
import styles from './AppointmentNote.module.scss';

const AppointmentNote = ({ visit, canEdit, onEdit }) => {
  return (
    <div className={styles['appointment-note']}>
      <div className={styles['appointment-note__note-date']}>
        {moment(visit.created).format('DD MMM YYYY HH:mm')}
      </div>
      <div className={styles['appointment-note__data-wrapper']}>
        <div className={styles['appointment-note__creator-info']}>
          <span className={styles['appointment-note__creator-info__doctor-title']}>
            {textForKey('Doctor')}:
          </span>
          <span className={styles['appointment-note__creator-info__doctor-name']}>
            {visit.doctorName}
          </span>
        </div>
        <div className={styles['appointment-note__note-text']}>
          {visit.note.length === 0 ? textForKey('No notes') : visit.note}
        </div>
        <div className={styles['services-container']}>
          {visit.services.map((service, index) => (
            <div key={`${service.id}-${index}`} className={styles['visit-service-item']}>
              {service.name} {service.toothId}
            </div>
          ))}
        </div>
        {canEdit && (
          <div
            role='button'
            tabIndex={0}
            className={styles['edit-note-btn']}
            onClick={() => onEdit(visit)}
          >
            <IconEditService />
          </div>
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
    doctorName: PropTypes.string,
    doctorId: PropTypes.number,
    created: PropTypes.string,
    services: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
