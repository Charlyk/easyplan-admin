import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import IconEditService from '../../../../assets/icons/iconEditService';
import { textForKey } from '../../../../utils/localization';

const AppointmentNote = ({ visit, canEdit, onEdit }) => {
  return (
    <div className='appointment-note'>
      <div className='appointment-note__note-date'>
        {moment(visit.created).format('DD MMM YYYY HH:mm')}
      </div>
      <div className='appointment-note__data-wrapper'>
        <div className='appointment-note__creator-info'>
          <span className='appointment-note__creator-info__doctor-title'>
            {textForKey('Doctor')}:
          </span>
          <span className='appointment-note__creator-info__doctor-name'>
            {visit.doctorName}
          </span>
        </div>
        <div className='appointment-note__note-text'>
          {visit.note.length === 0 ? textForKey('No notes') : visit.note}
        </div>
        <div className='services-container'>
          {visit.services.map((service, index) => (
            <div key={`${service.id}-${index}`} className='visit-service-item'>
              {service.name} {service.toothId}
            </div>
          ))}
        </div>
        {canEdit && (
          <div
            role='button'
            tabIndex={0}
            className='edit-note-btn'
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
    id: PropTypes.string,
    note: PropTypes.string,
    doctorName: PropTypes.string,
    doctorId: PropTypes.string,
    created: PropTypes.string,
    services: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};