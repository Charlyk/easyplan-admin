import React, { useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import isEqual from 'lodash/isEqual';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import SwitchButton from 'app/components/common/SwitchButton';
import IconSuccess from 'app/components/icons/iconSuccess';
import NotificationsContext from 'app/context/notificationsContext';
import onRequestFailed from 'app/utils/onRequestFailed';
import { updateClinicBraces } from 'middleware/api/clinic';
import {
  clinicBracesSelector,
  clinicCurrencySelector,
} from 'redux/selectors/appDataSelector';
import { setCurrentClinic } from 'redux/slices/appDataSlice';
import styles from './BracesSettings.module.scss';

const BracesSettings = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
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
      const response = await updateClinicBraces({ services: clinicBraces });
      dispatch(setCurrentClinic(response.data));
      toast.success(textForKey('saved successfully'));
    } catch (error) {
      onRequestFailed(error, toast);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles['braces-settings']}>
      <span className={styles['form-title']}>
        {textForKey('braces settings')}
      </span>
      <div className={styles['braces-settings__data-wrapper']}>
        <table>
          <thead>
            <tr>
              <th width={42} align='center'>
                {''}
              </th>
              <th align='left'>{textForKey('name')}</th>
              <th width={150} align='right'>
                {textForKey('price')}
              </th>
              <th width={150} align='right'>
                {textForKey('duration')}
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
                <td>{item.name}</td>
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
          {textForKey('save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default BracesSettings;
