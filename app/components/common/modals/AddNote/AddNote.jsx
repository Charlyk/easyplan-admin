import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import EASTextarea from 'app/components/common/EASTextarea';
import EASModal from 'app/components/common/modals/EASModal';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import { createPatientNote, updateVisitNote } from 'middleware/api/patients';
import { updateNotes } from 'redux/slices/mainReduxSlice';
import styles from './AddNote.module.scss';

const AddNote = ({ open, patientId, visit, mode, scheduleId, onClose }) => {
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) setNoteText('');
  }, [open]);

  useEffect(() => {
    if (visit != null) {
      setNoteText(visit.note);
    }
  }, [visit]);

  const handleNoteChange = (newValue) => {
    setNoteText(newValue);
  };

  const handleSaveNote = async (event) => {
    event?.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'visits') {
        await updateVisitNote(patientId, visit.id, noteText);
        dispatch(updateNotes());
        onClose();
      } else {
        const requestBody = {
          note: noteText,
          mode,
          scheduleId,
        };
        await createPatientNote(patientId, requestBody);
        dispatch(updateNotes());
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EASModal
      open={open}
      className={styles.addNoteRoot}
      paperClass={styles.modalPaper}
      title={textForKey('Create note')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={noteText.length === 0}
      onPrimaryClick={handleSaveNote}
      onClose={onClose}
    >
      <form className={styles.modalContent} onSubmit={handleSaveNote}>
        <EASTextarea
          fieldLabel={textForKey('Enter note')}
          value={noteText}
          rows={4}
          maxRows={5}
          onChange={handleNoteChange}
        />
      </form>
    </EASModal>
  );
};

export default AddNote;

AddNote.propTypes = {
  open: PropTypes.bool.isRequired,
  patientId: PropTypes.number,
  onClose: PropTypes.func,
  mode: PropTypes.string.isRequired,
  visit: PropTypes.object,
  scheduleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
