import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import EASTextarea from 'app/components/common/EASTextarea';
import { dispatchUpdateVisit } from 'app/components/dashboard/patients/PatientDetailsModal/AppointmentNotes/AppointmentNotes.reducer';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import { createPatientNote } from 'middleware/api/patients';
import { updateNotes } from 'redux/slices/mainReduxSlice';
import EASModal from '../EASModal';
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

  const handleUpdateVisitNote = () => {
    const request = {
      patientId,
      visitId: visit.id,
      note: noteText,
    };
    dispatch(dispatchUpdateVisit(request));
    onClose();
  };

  const handleCreatePatientNote = async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        note: noteText,
        mode,
        scheduleId,
      };
      await createPatientNote(patientId, requestBody);
      dispatch(updateNotes());
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (event) => {
    event?.preventDefault();

    if (mode === 'visits') {
      handleUpdateVisitNote();
    } else {
      await handleCreatePatientNote();
    }
  };

  return (
    <EASModal
      open={open}
      className={styles.addNoteRoot}
      paperClass={styles.modalPaper}
      title={textForKey('add note')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={noteText.length === 0}
      onPrimaryClick={handleSaveNote}
      onClose={onClose}
    >
      <form className={styles.modalContent} onSubmit={handleSaveNote}>
        <EASTextarea
          fieldLabel={textForKey('enter_the_note')}
          value={noteText}
          rows={4}
          maxRows={5}
          onChange={handleNoteChange}
          maxLength={1000}
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
