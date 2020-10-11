import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import { textForKey } from '../../utils/localization';

import './styles.scss';

import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import { uploadFileToAWS } from '../../utils/helperFuncs';
import dataAPI from '../../utils/api/dataAPI';
import { triggerUpdateXRay } from '../../redux/actions/actions';

import { useDispatch } from 'react-redux';

const AddXRay = ({ open, patientId, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [phase, setPhase] = useState('Initial');

  useEffect(() => {
    if (!open) setImageFile(null);
  }, [open]);

  const handleFileChange = event => {
    setImageFile(event.target.files[0]);
  };

  const handleSaveImage = async () => {
    setIsLoading(true);
    const uploadResult = await uploadFileToAWS('x-ray', imageFile);
    if (!uploadResult) return;
    await dataAPI.addXRayImage(patientId, {
      imageUrl: uploadResult.location,
      type: phase,
    });
    dispatch(triggerUpdateXRay());
    setIsLoading(false);
    onClose();
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
      isPositiveLoading={isLoading}
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
  patientId: PropTypes.string,
  onClose: PropTypes.func,
};

AddXRay.defaultProps = {
  onClose: () => null,
};
