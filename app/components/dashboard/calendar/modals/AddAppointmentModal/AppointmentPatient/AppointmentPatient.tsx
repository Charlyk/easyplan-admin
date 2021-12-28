import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import EASModal from 'app/components/common/modals/EASModal';
import { PatientSources } from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import { textForKey } from 'app/utils/localization';
import {
  arePatientsLoadingSelector,
  createdPatientSelector,
} from 'redux/selectors/patientSelector';
import {
  dispatchCreatePatient,
  setCreatedPatient,
} from 'redux/slices/patientsListSlice';
import { PatientSource } from 'types';
import { CreatePatientRequest } from 'types/api';
import styles from './AppointmentPatient.module.scss';
import {
  AppointmentPatientProps,
  CountryData,
} from './AppointmentPatient.types';

const initialState = {
  fullName: '',
  phoneNumber: '',
  countryCode: '373',
  source: PatientSource.Unknown,
  isPhoneValid: false,
  country: { dialCode: '373', countryCode: 'md' },
};

const AppointmentPatient: React.FC<AppointmentPatientProps> = ({
  open,
  value,
  onClose,
  onSaved,
}) => {
  const dispatch = useDispatch();
  const createdPatient = useSelector(createdPatientSelector);
  const isLoading = useSelector(arePatientsLoadingSelector);
  const [patientData, setPatientData] = useState({
    ...initialState,
    fullName: value ?? '',
  });

  useEffect(() => {
    if (open) {
      dispatch(setCreatedPatient(null));
      setPatientData(initialState);
    }
  }, [open]);

  useEffect(() => {
    if (createdPatient == null) {
      return;
    }

    const phoneNumber = `+${createdPatient.countryCode}${createdPatient.phoneNumber}`;
    const searchName = `${createdPatient.fullName} ${phoneNumber}`;
    onSaved?.({
      ...createdPatient,
      name: searchName,
      label: createdPatient.fullName,
    });
    onClose?.();
  }, [createdPatient]);

  useEffect(() => {
    setPatientData({ ...patientData, fullName: value });
  }, [value]);

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
    setPatientData({
      ...patientData,
      fullName: value,
    });
  };

  const handlePatientSourceChange = (event) => {
    setPatientData({
      ...patientData,
      source: event.target.value,
    });
  };

  const handleSavePatient = () => {
    const phoneNumber = patientData.phoneNumber.replace(
      patientData.country.dialCode,
      '',
    );

    const names = patientData.fullName.split(' ');
    const firstName = names[0] ?? '';
    const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

    const requestBody: CreatePatientRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      source: patientData.source,
      phoneNumber,
      countryCode: patientData.countryCode,
    };

    dispatch(dispatchCreatePatient(requestBody));
  };

  return (
    <EASModal
      open={open}
      size='medium'
      onClose={onClose}
      onPrimaryClick={handleSavePatient}
      isPositiveLoading={isLoading}
      isPositiveDisabled={!patientData.isPhoneValid || isLoading}
      title={textForKey('Create patient')}
    >
      <div className={styles.appointmentPatient}>
        <Box display='flex' flexDirection='column'>
          <EASTextField
            id='patientFullName'
            type='text'
            placeholder='John Doe'
            value={patientData.fullName}
            containerClass={styles.nameField}
            fieldLabel={textForKey('first_n_last_name')}
            onChange={handleFieldChange}
          />

          <EASPhoneInput
            fieldLabel={textForKey('Phone number')}
            rootClass={styles.phoneInput}
            value={patientData.phoneNumber}
            country={patientData.country.countryCode}
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
