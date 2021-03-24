import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { triggerUpdateNotes } from '../../../redux/actions/actions';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/AddNote.module.scss';
import EasyPlanModal from '../../common/EasyPlanModal';
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";

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
    try {
      if (mode === 'visits') {
        const query = new URLSearchParams({ visitId: visit.id }).toString()
        await axios.put(
          `${baseAppUrl}/api/patients/${patientId}/visits?${query}`,
          { note: noteText }
        );
        dispatch(triggerUpdateNotes());
        onClose();
      } else {
        const requestBody = {
          note: noteText,
          mode,
          scheduleId,
        };
        await axios.post(`${baseAppUrl}/api/patients/${patientId}/notes`, requestBody)
        dispatch(triggerUpdateNotes());
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className={styles.addNoteRoot}
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