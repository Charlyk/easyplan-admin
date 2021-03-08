import React, { useState } from 'react';

import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconSuccess from '../../../../components/icons/iconSuccess';
import LoadingButton from '../../../../components/LoadingButton';
import { setClinic } from '../../../../redux/actions/clinicActions';
import { clinicDetailsSelector } from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';
import styles from './ApplicationSettings.module.scss'

const ApplicationSettings = () => {
  const dispatch = useDispatch();
  const clinic = useSelector(clinicDetailsSelector);
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
    const requestBody = {
      ...clinic,
      timeBeforeOnSite: parseInt(time),
    };

    const response = await dataAPI.updateClinic(requestBody);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(setClinic(response.data));
    }
    setIsLoading(false);
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
