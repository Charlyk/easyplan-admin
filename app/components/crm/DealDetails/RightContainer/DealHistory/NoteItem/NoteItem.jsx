import React from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import styles from './NoteItem.module.scss';
import moment from "moment-timezone";

const NoteItem = ({ note }) => {
  return (
    <div className={styles.noteItem}>
      <img src="/icon-notes-64.png" alt="Notes"/>
      <div className={styles.dataWrapper}>
        <Typography className={styles.dateText}>
          {moment(note.created).format('DD.MM.YYYY HH:mm')}{' '}
          {note.createdBy.firstName} {note.createdBy.lastName}
        </Typography>
        <Typography className={styles.noteText}>{note.noteText}</Typography>
      </div>
    </div>
  )
};

export default NoteItem;

NoteItem.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    itemType: PropTypes.string,
    lastUpdated: PropTypes.string,
    noteText: PropTypes.string,
    createdBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  })
};
