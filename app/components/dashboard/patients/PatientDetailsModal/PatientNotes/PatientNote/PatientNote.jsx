import React from 'react';
import { Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { textForKey } from 'app/utils/localization';
import styles from './PatientNote.module.scss';

const PatientNote = ({ note }) => {
  return (
    <div className={styles.noteItem}>
      <div className={styles.noteDate}>
        {moment(note.created).format('DD MMM YYYY HH:mm')}{' '}
        {textForKey('created by')} {note.createdBy}
      </div>
      <Typography className={styles.noteText}>{note.noteText}</Typography>
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
