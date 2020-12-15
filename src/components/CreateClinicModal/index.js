import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Form, Image, InputGroup } from 'react-bootstrap';

import IconAvatar from '../../assets/icons/iconAvatar';
import authAPI from '../../utils/api/authAPI';
import dataAPI from '../../utils/api/dataAPI';
import { uploadFileToAWS } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const CreateClinicModal = ({ open, onCreate, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    logoFile: null,
    clinicName: '',
    website: '',
    description: '',
  });

  const handleFormChange = event => {
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handleLogoChange = event => {
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, logoFile: files[0] });
    }
  };

  const submitForm = async () => {
    if (!isFormValid() || isLoading) {
      return;
    }

    setIsLoading(true);
    let logo = null;
    if (data.logoFile != null) {
      const uploadResult = await uploadFileToAWS('avatars', data.logoFile);
      logo = uploadResult?.location;
    }

    const response = await dataAPI.createClinic({
      clinicName: data.clinicName,
      website: data.website,
      description: data.description,
      logo,
    });

    if (response.isError) {
      console.error(response.message);
    } else {
      const userResponse = await authAPI.me();
      if (!userResponse.isError) {
        onCreate(userResponse.data);
      }
    }

    setIsLoading(false);
  };

  const isFormValid = () => data.clinicName.length > 3;

  const logoSrc = data.logoFile && window.URL.createObjectURL(data.logoFile);

  return (
    <EasyPlanModal
      className='create-clinic-modal-root'
      open={open}
      onClose={onClose}
      onPositiveClick={submitForm}
      isPositiveDisabled={!isFormValid()}
      isPositiveLoading={isLoading}
      title={textForKey('Create clinic')}
    >
      <div className='upload-avatar-container'>
        {logoSrc ? <Image roundedCircle src={logoSrc} /> : <IconAvatar />}
        <span style={{ margin: '1rem' }}>
          {textForKey('JPG or PNG, Max size of 800kb')}
        </span>
        <Form.Group>
          <input
            className='custom-file-button'
            type='file'
            name='logo-file'
            id='logo-file'
            accept='.jpg,.jpeg,.png'
            onChange={handleLogoChange}
          />
          <label htmlFor='logo-file'>{textForKey('Upload image')}</label>
        </Form.Group>
      </div>
      <Form.Group controlId='clinicName'>
        <Form.Label>{textForKey('Clinic name')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={data.clinicName}
            type='text'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='website'>
        <Form.Label>{`${textForKey('Website')} (${textForKey(
          'optional',
        ).toLowerCase()})`}</Form.Label>
        <InputGroup>
          <Form.Control
            value={data.website}
            type='text'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='description'>
        <Form.Label>{`${textForKey('About clinic')} (${textForKey(
          'optional',
        ).toLowerCase()})`}</Form.Label>
        <InputGroup>
          <Form.Control
            as='textarea'
            value={data.description}
            onChange={handleFormChange}
            aria-label='With textarea'
          />
        </InputGroup>
      </Form.Group>
    </EasyPlanModal>
  );
};

export default CreateClinicModal;

CreateClinicModal.propTypes = {
  open: PropTypes.bool,
  onCreate: PropTypes.func,
  onClose: PropTypes.func,
};

CreateClinicModal.defaultProps = {
  onClose: null,
};
