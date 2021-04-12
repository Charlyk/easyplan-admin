import React, { useState } from 'react';

import { Form, InputGroup } from 'react-bootstrap';

import IconSuccess from '../../icons/iconSuccess';
import LoadingButton from '../../common/LoadingButton';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/ApplicationSettings.module.scss'
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { updateClinic } from "../../../middleware/api/clinic";

const ApplicationSettings = ({ currentClinic: clinic }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(String(clinic.timeBeforeOnSite));

  const handleFormChange = event => {
    const newValue = event.target.value;
    setTime(newValue);
  };

  const isFormValid = () => {
    return time.length > 0;
  };

  const saveTimer = async () => {
    if (!isFormValid()) return;
    setIsLoading(true);
    try {
      const requestBody = {
        ...clinic,
        timeBeforeOnSite: parseInt(time),
      };
      await updateClinic(requestBody);
      router.replace(router.asPath);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['application-settings-form']}>
      <span className={styles['form-title']}>{textForKey('Application settings')}</span>
      <div className={styles['data-wrapper']}>
        <Form.Group controlId='clinicName'>
          <Form.Label>{textForKey('Animate appointments before')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={time}
              type='number'
              onChange={handleFormChange}
            />
          </InputGroup>
          <Form.Text>{textForKey('appointment_animation_timer')}</Form.Text>
        </Form.Group>
      </div>
      <div className={styles['footer']}>
        <LoadingButton
          onClick={saveTimer}
          className='positive-button'
          isLoading={isLoading}
          disabled={isLoading || !isFormValid()}
        >
          {textForKey('Save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default ApplicationSettings;
