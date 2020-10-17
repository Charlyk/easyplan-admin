import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { triggerUpdateNotes } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import './styles.scss';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const AddNote = ({ open, patientId, mode, scheduleId, onClose }) => {
  const dispatch = useDispatch();
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) setNoteText('');
  }, [open]);

  const handleNoteChange = event => {
    setNoteText(event.target.value);
  };

  const handleSaveNote = async () => {
    setIsLoading(true);
    const requestBody = {
      note: noteText,
      mode,
      scheduleId,
    };
    await dataAPI.createPatientNote(patientId, requestBody);
    logUserAction(
      Action.CreatePatientNote,
      JSON.stringify({ patientId, requestBody }),
    );
    dispatch(triggerUpdateNotes());
    setIsLoading(false);
    onClose();
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
      <label htmlFor='basic-url'>{textForKey('Enter note')}</label>
      <FormControl
        onChange={handleNoteChange}
        value={noteText}
        as='textarea'
        aria-label={textForKey('Enter category name')}
      />
    </EasyPlanModal>
  );
};

export default AddNote;

AddNote.propTypes = {
  open: PropTypes.bool.isRequired,
  patientId: PropTypes.string,
  onClose: PropTypes.func,
  mode: PropTypes.string.isRequired,
  scheduleId: PropTypes.string,
};
