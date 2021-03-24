import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { triggerUpdateXRay } from '../../../redux/actions/actions';
import { uploadFileToAWS } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../../common/EasyPlanModal';

import styles from '../../../styles/AddXRay.module.scss';
import { toast } from "react-toastify";
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";

const AddXRay = ({ open, patientId, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [phase, setPhase] = useState('Initial');

  useEffect(() => {
    if (!open) setImageFile(null);
  }, [open]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleSaveImage = async () => {
    setIsLoading(true);
    const uploadResult = await uploadFileToAWS('x-ray', imageFile);
    if (!uploadResult) return;
    try {
      const requestBody = {
        imageUrl: uploadResult.location,
        type: phase,
      };
      await axios.post(`${baseAppUrl}/api/patients/${patientId}/x-ray`, requestBody)
      dispatch(triggerUpdateXRay());
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhaseChange = (event) => {
    setPhase(event.target.value);
  };

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className={styles['add-x-ray-root']}
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
  patientId: PropTypes.number,
  onClose: PropTypes.func,
};

AddXRay.defaultProps = {
  onClose: () => null,
};
