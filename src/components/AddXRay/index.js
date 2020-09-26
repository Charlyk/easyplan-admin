import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import { textForKey } from '../../utils/localization';

import './styles.scss';

import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const AddXRay = ({ open, onClose, onSave, isSaving }) => {
  const [imageFile, setImageFile] = useState(null);
  const [phase, setPhase] = useState('Initial');

  useEffect(() => {
    if (!open) setImageFile(null);
  }, [open]);

  const handleFileChange = event => {
    setImageFile(event.target.files[0]);
  };

  const handleSaveImage = () => {
    onSave({ phase, imageFile });
  };

  const handlePhaseChange = event => {
    setPhase(event.target.value);
  };

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className='add-x-ray-root'
      title={textForKey('Add X-Ray image')}
      isPositiveLoading={isSaving}
      isPositiveDisabled={imageFile == null || phase == null}
      onPositiveClick={handleSaveImage}
    >
      <Form.Group>
        <Form.Label>{textForKey('Upload image')}</Form.Label>
        <input
          className='custom-file-input'
          type='file'
          name='x-ray-file'
          id='x-ray-file'
          accept='.jpg,.jpeg,.png'
          onChange={handleFileChange}
        />
        <label htmlFor='x-ray-file'>{imageFile?.name}</label>
      </Form.Group>

      <Form.Group>
        <Form.Label>{textForKey('Select phase')}</Form.Label>
        <Form.Control
          onChange={handlePhaseChange}
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          custom
        >
          <option value='Initial'>{textForKey('Initial phase')}</option>
          <option value='Middle'>{textForKey('Middle phase')}</option>
          <option value='Final'>{textForKey('Final phase')}</option>
        </Form.Control>
      </Form.Group>
    </EasyPlanModal>
  );
};

export default AddXRay;

AddXRay.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};
