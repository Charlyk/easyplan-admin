import React, { useState } from 'react';
import isEqual from 'lodash/isEqual';
import { useRouter } from "next/router";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { toast } from 'react-toastify';

import IconSuccess from '../../../icons/iconSuccess';
import LoadingButton from '../../../../../components/common/LoadingButton';
import SwitchButton from '../../../../../components/common/SwitchButton';
import { textForKey } from '../../../../../utils/localization';
import { clinicBracesSelector } from "../../../../../redux/selectors/clinicSelector";
import { updateClinicBraces } from "../../../../../middleware/api/clinic";
import styles from './BracesSettings.module.scss';

const BracesSettings = ({ currentClinic: clinic }) => {
  const router = useRouter();
  const braces = clinicBracesSelector(clinic);
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
    try {
      await updateClinicBraces({ services: clinicBraces });
      router.replace(router.asPath);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
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
          <IconSuccess/>
        </LoadingButton>
      </div>
    </div>
  );
};

export default BracesSettings;
