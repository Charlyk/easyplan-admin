import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import { textForKey } from '../../../../utils/localization';

const PatientNote = ({ note }) => {
  return (
    <div className='patient-notes-list__item'>
      <div className='patient-notes-list__item__note-date'>
        {moment(note.created).format('DD MMM YYYY HH:mm')}{' '}
        {textForKey('created by')} {note.createdBy}
      </div>
      <div className='patient-notes-list__item__note-text'>{note.noteText}</div>
    </div>
  );
};

export default PatientNote;

PatientNote.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number,
    noteText: PropTypes.string,
    createdByName: PropTypes.string,
    created: PropTypes.string,
    doctorId: PropTypes.number,
  }).isRequired,
};
