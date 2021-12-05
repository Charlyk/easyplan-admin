import React, { useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import SwitchButton from 'app/components/common/SwitchButton';
import IconSuccess from 'app/components/icons/iconSuccess';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import { updateClinicBraces } from 'middleware/api/clinic';
import {
  clinicBracesSelector,
  clinicCurrencySelector,
} from 'redux/selectors/appDataSelector';
import styles from './BracesSettings.module.scss';

const BracesSettings = () => {
  const router = useRouter();
  const toast = useContext(NotificationsContext);
  const braces = useSelector(clinicBracesSelector);
  const currency = useSelector(clinicCurrencySelector);
  const [isSaving, setIsSaving] = useState(false);
  const [clinicBraces, setClinicBraces] = useState(braces);

  const handleItemToggle = (service) => {
    setClinicBraces(
      clinicBraces.map((item) => {
        if (item.id !== service.id) return item;
        return { ...item, isEnabled: !item.isEnabled };
      }),
    );
  };

  const handlePriceChange = (newValue, serviceId) => {
    const service = clinicBraces.find((item) => item.id === serviceId);
    if (service == null) {
      return;
    }
    const adjustedValue = newValue.length > 0 ? newValue : '0';
    setClinicBraces(
      clinicBraces.map((item) => {
        if (item.id !== serviceId) return item;
        return { ...item, price: parseFloat(adjustedValue) };
      }),
    );
  };

  const handleDurationChange = (newValue, serviceId) => {
    const service = clinicBraces.find((item) => item.id === serviceId);
    if (service == null) {
      return;
    }
    const adjustedValue = newValue.length > 0 ? newValue : '0';
    setClinicBraces(
      clinicBraces.map((item) => {
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
      <span className={styles['form-title']}>
        {textForKey('Braces settings')}
      </span>
      <div className={styles['braces-settings__data-wrapper']}>
        <table>
          <thead>
            <tr>
              <th width={42} align='center'>
                {''}
              </th>
              <th align='left'>{textForKey('Name')}</th>
              <th width={150} align='right'>
                {textForKey('Price')}
              </th>
              <th width={150} align='right'>
                {textForKey('Duration')}
              </th>
            </tr>
          </thead>
          <tbody>
            {clinicBraces.map((item) => (
              <tr key={item.id}>
                <td width={42} align='center'>
                  <SwitchButton
                    isChecked={item.isEnabled}
                    onChange={() => handleItemToggle(item)}
                  />
                </td>
                <td>{textForKey(item.name)}</td>
                <td width={150} align='right'>
                  <EASTextField
                    type='number'
                    value={String(item.price)}
                    readOnly={!item.isEnabled}
                    onChange={(value) => handlePriceChange(value, item.id)}
                    endAdornment={
                      <Typography className={styles.adornment}>
                        {currency}
                      </Typography>
                    }
                  />
                </td>
                <td width={150} align='right'>
                  <EASTextField
                    type='number'
                    value={String(item.duration)}
                    readOnly={!item.isEnabled}
                    onChange={(value) => handleDurationChange(value, item.id)}
                    endAdornment={
                      <Typography className={styles.adornment}>min</Typography>
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles['footer']}>
        <LoadingButton
          onClick={handleSaveBracesSettings}
          className={styles.saveButton}
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
