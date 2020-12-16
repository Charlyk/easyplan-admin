import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { triggerUpdateNotes } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import './styles.scss';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const AddNote = ({ open, patientId, visit, mode, scheduleId, onClose }) => {
  const dispatch = useDispatch();
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

  const handleNoteChange = event => {
    setNoteText(event.target.value);
  };

  const handleSaveNote = async () => {
    setIsLoading(true);
    if (mode === 'visits') {
      console.log(patientId, scheduleId);
      const visitResponse = await dataAPI.editVisitNote(
        patientId,
        visit.id,
        noteText,
      );
      if (visitResponse.isError) {
        toast.error(textForKey(visitResponse.message));
      } else {
        logUserAction(
          Action.EditVisitNote,
          JSON.stringify({ visitId: visit.id, scheduleId, noteText }),
        );
        dispatch(triggerUpdateNotes());
        onClose();
      }
    } else {
      const requestBody = {
        note: noteText,
        mode,
        scheduleId,
      };
      const createNoteResponse = await dataAPI.createPatientNote(
        patientId,
        requestBody,
      );
      if (createNoteResponse.isError) {
        toast.error(textForKey(createNoteResponse.message));
      } else {
        logUserAction(
          Action.CreatePatientNote,
          JSON.stringify({ patientId, requestBody }),
        );
        dispatch(triggerUpdateNotes());
        onClose();
      }
    }
    setIsLoading(false);
  };

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className='add-note-root'
      title={textForKey('Create note')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={noteText.length === 0}
      onPositiveClick={handleSaveNote}
    >
      <Form.Group>
        <Form.Label>{textForKey('Enter note')}</Form.Label>
        <Form.Control
          onChange={handleNoteChange}
          value={noteText}
          as='textarea'
          aria-label={textForKey('Enter category name')}
        />
      </Form.Group>
    </EasyPlanModal>
  );
};

export default AddNote;

AddNote.propTypes = {
  open: PropTypes.bool.isRequired,
  patientId: PropTypes.number,
  onClose: PropTypes.func,
  mode: PropTypes.string.isRequired,
  visit: PropTypes.object,
  scheduleId: PropTypes.string,
};
