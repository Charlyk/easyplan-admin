import React, { useEffect, useState } from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form, Image, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import IconAvatar from '../../icons/iconAvatar';
import { uploadFileToAWS } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../../../src/components/EasyPlanModal';

import styles from '../../../styles/CreateClinicModal.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";

const CreateClinicModal = ({ open, onCreate, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeZones, setTimeZones] = useState([]);
  const [data, setData] = useState({
    logoFile: null,
    clinicName: '',
    website: '',
    description: '',
    timeZone: moment.tz.guess(true),
  });

  useEffect(() => {
    fetchTimeZones();
  }, []);

  const fetchTimeZones = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseAppUrl}/api/clinic/timezones`);
      setTimeZones(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (event) => {
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handleLogoChange = (event) => {
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
    try {
      let logo = null;
      if (data.logoFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', data.logoFile);
        logo = uploadResult?.location;
      }
      const requestBody = {
        clinicName: data.clinicName,
        website: data.website,
        description: data.description,
        defaultCurrency: 'MDL',
        logo,
      };
      const response = await axios.post(`${baseAppUrl}/api/clinic`, requestBody);
      onCreate(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => data.clinicName.length > 3;

  const logoSrc = data.logoFile && window.URL.createObjectURL(data.logoFile);

  return (
    <EasyPlanModal
      className={styles['create-clinic-modal-root']}
      open={open}
      onClose={onClose}
      onPositiveClick={submitForm}
      isPositiveDisabled={!isFormValid() || isLoading}
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
      <Form.Group controlId='timeZone'>
        <Form.Label>{textForKey('Time zone')}</Form.Label>
        <Form.Control
          as='select'
          onChange={handleFormChange}
          value={data.timeZone}
          custom
        >
          {timeZones.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Form.Control>
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
