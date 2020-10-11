import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import { textForKey } from '../../../../../utils/localization';

const AppointmentNote = ({ note }) => {
  return (
    <div className='appointment-note'>
      <div className='appointment-note__note-date'>
        {moment(note.created).format('DD MMM YYYY HH:mm')}
      </div>
      <div className='appointment-note__data-wrapper'>
        <div className='appointment-note__creator-info'>
          <span className='appointment-note__creator-info__doctor-title'>
            {textForKey('Doctor')}:
          </span>
          <span className='appointment-note__creator-info__doctor-name'>
            {note.createdByName}
          </span>
        </div>
        <div className='appointment-note__note-text'>{note.noteText}</div>
      </div>
    </div>
  );
};

export default AppointmentNote;

AppointmentNote.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    noteText: PropTypes.string,
    createdById: PropTypes.string,
    createdByName: PropTypes.string,
    created: PropTypes.string,
  }).isRequired,
};
