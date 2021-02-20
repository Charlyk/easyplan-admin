import React, { useState } from 'react';

import isEqual from 'lodash/isEqual';
import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconSuccess from '../../../assets/icons/iconSuccess';
import LoadingButton from '../../../components/LoadingButton';
import SwitchButton from '../../../components/SwitchButton';
import { setClinic } from '../../../redux/actions/clinicActions';
import {
  clinicBracesSelector,
  clinicDetailsSelector,
} from '../../../redux/selectors/clinicSelector';
import dataAPI from '../../../utils/api/dataAPI';
import { textForKey } from '../../../utils/localization';
import styles from './BracesSettings.module.scss';

const BracesSettings = () => {
  const dispatch = useDispatch();
  const clinic = useSelector(clinicDetailsSelector);
  const braces = useSelector(clinicBracesSelector);
  const [isSaving, setIsSaving] = useState(false);
  const [clinicBraces, setClinicBraces] = useState(braces);

  const handleItemToggle = service => {
    setClinicBraces(
      clinicBraces.map(item => {
        if (item.id !== service.id) return item;
        return { ...item, isEnabled: !item.isEnabled };
      }),
    );
  };

  const handlePriceChange = (event, serviceId) => {
    const service = clinicBraces.find(item => item.id === serviceId);
    if (service == null) {
      return;
    }
    const newValue = event.target.value;
    const adjustedValue = newValue.length > 0 ? newValue : '0';
    setClinicBraces(
      clinicBraces.map(item => {
        if (item.id !== serviceId) return item;
        return { ...item, price: parseFloat(adjustedValue) };
      }),
    );
  };

  const handleDurationChange = (event, serviceId) => {
    const service = clinicBraces.find(item => item.id === serviceId);
    if (service == null) {
      return;
    }
    const newValue = event.target.value;
    const adjustedValue = newValue.length > 0 ? newValue : '0';
    setClinicBraces(
      clinicBraces.map(item => {
        if (item.id !== serviceId) return item;
        return { ...item, duration: parseInt(adjustedValue) };
      }),
    );
  };

  const handleSaveBracesSettings = async () => {
    setIsSaving(true);
    const response = await dataAPI.updateBracesSettings(clinicBraces);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      dispatch(setClinic(response.data));
      toast.success(textForKey('Saved successfully'));
    }
    setIsSaving(false);
  };

  return (
    <div className={styles['braces-settings']}>
      <span className={styles['form-title']}>{textForKey('Braces settings')}</span>
      <div className={styles['braces-settings__data-wrapper']}>
        <table>
          <thead>
            <tr>
              <th width={42} align='center'>
                {''}
              </th>
              <th>{textForKey('Name')}</th>
              <th width={150} align='right'>
                {textForKey('Price')}
              </th>
              <th width={150} align='right'>
                {textForKey('Duration')}
              </th>
            </tr>
          </thead>
          <tbody>
            {clinicBraces.map(item => (
              <tr key={item.id}>
                <td width={42} align='center'>
                  <SwitchButton
                    isChecked={item.isEnabled}
                    onChange={() => handleItemToggle(item)}
                  />
                </td>
                <td>{textForKey(item.name)}</td>
                <td width={150} align='right'>
                  <InputGroup>
                    <Form.Control
                      disabled={!item.isEnabled}
                      className='mr-sm-2'
                      onChange={event => handlePriceChange(event, item.id)}
                      value={String(item.price)}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>{clinic.currency}</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </td>
                <td width={150} align='right'>
                  <InputGroup>
                    <Form.Control
                      disabled={!item.isEnabled}
                      className='mr-sm-2'
                      onChange={event => handleDurationChange(event, item.id)}
                      value={String(item.duration)}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>min</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles['footer']}>
        <LoadingButton
          onClick={handleSaveBracesSettings}
          className='positive-button'
          isLoading={isSaving}
          disabled={isSaving || isEqual(braces, clinicBraces)}
        >
          {textForKey('Save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default BracesSettings;
