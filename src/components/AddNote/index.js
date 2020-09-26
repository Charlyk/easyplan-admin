import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { textForKey } from '../../utils/localization';
import './styles.scss';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

import { FormControl } from 'react-bootstrap';

const AddNote = ({ open, onClose, onSave, isSaving }) => {
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (!open) setNoteText('');
  }, [open]);

  const handleNoteChange = event => {
    setNoteText(event.target.value);
  };

  const handleSaveNote = () => {
    onSave(noteText);
  };

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className='add-note-root'
      title={textForKey('Create note')}
      isPositiveLoading={isSaving}
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
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};
