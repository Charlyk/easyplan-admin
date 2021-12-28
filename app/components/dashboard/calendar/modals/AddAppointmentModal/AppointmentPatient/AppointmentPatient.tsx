import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import EASModal from 'app/components/common/modals/EASModal';
import { PatientSources } from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import { textForKey } from 'app/utils/localization';
import styles from './AppointmentPatient.module.scss';
import {
  AppointmentPatientProps,
  CountryData,
} from './AppointmentPatient.types';

const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  countryCode: '373',
  source: 'Unknown',
  isPhoneValid: false,
  country: { dialCode: '373', countryCode: 'md' },
};

const AppointmentPatient: React.FC<AppointmentPatientProps> = ({
  open,
  value,
  onClose,
  onSaved,
}) => {
  const [patientData, setPatientData] = useState({
    ...initialState,
    firstName: value ?? '',
  });

  const handlePhoneChange = (value: string, country: CountryData, _event) => {
    setPatientData({
      ...patientData,
      phoneNumber: value,
      countryCode: country.dialCode,
      isPhoneValid: isPhoneNumberValid(value, country),
      country,
    });
  };

  const handleFieldChange = (value: string) => {
    const firstName = value.substring(0, value.indexOf(' '));
    const lastName = value.substring(value.indexOf(' ') + 1);
    setPatientData({
      ...patientData,
      firstName,
      lastName,
    });
  };

  const handlePatientSourceChange = (event) => {
    setPatientData({
      ...patientData,
      source: event.target.value,
    });
  };

  const handleSavePatient = () => {
    onSaved?.({
      ...patientData,
      id: 1,
      avatar: null,
      fullName: `${patientData.firstName} ${patientData.lastName}`,
      discount: 0,
      tags: [],
    });
    onClose?.();
  };

  return (
    <EASModal
      open={open}
      size='medium'
      onClose={onClose}
      onPrimaryClick={handleSavePatient}
      isPositiveDisabled={!patientData.isPhoneValid}
      title={textForKey('Create patient')}
    >
      <div className={styles.appointmentPatient}>
        <Box display='flex' flexDirection='column'>
          <EASTextField
            id='patientFullName'
            type='text'
            placeholder='John Doe'
            containerClass={styles.nameField}
            fieldLabel={textForKey('first_n_last_name')}
            onChange={handleFieldChange}
          />

          <EASPhoneInput
            fieldLabel={textForKey('Phone number')}
            rootClass={styles.phoneInput}
            value={''}
            country={'md'}
            onChange={handlePhoneChange}
          />

          <EASSelect
            label={textForKey('patient_source')}
            labelId='patient-source-select'
            options={PatientSources}
            value={'Unknown'}
            rootClass={styles.simpleField}
            onChange={handlePatientSourceChange}
          />
        </Box>
      </div>
    </EASModal>
  );
};

export default AppointmentPatient;
