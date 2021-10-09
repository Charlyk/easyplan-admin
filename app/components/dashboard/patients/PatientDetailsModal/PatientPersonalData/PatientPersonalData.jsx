import React, { useEffect, useReducer, useRef } from 'react';
import dynamic from 'next/dynamic';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

import IconSuccess from '../../../../icons/iconSuccess';
import { EmailRegex } from '../../../../../utils/constants';
import adjustValueToNumber from '../../../../../utils/adjustValueToNumber';
import { textForKey } from '../../../../../utils/localization';
import LoadingButton from '../../../../common/LoadingButton';
import { actions, initialState, reducer } from './PatientPersonalData.reducer';
import { updatePatient } from "../../../../../../middleware/api/patients";
import isPhoneNumberValid from "../../../../../utils/isPhoneNumberValid";
import EASTextField from "../../../../common/EASTextField";
import EASPhoneInput from "../../../../common/EASPhoneInput";
import styles from './PatientPersonalData.module.scss';

const EasyDatePicker = dynamic(() => import('../../../../common/EasyDatePicker'));

const PatientPersonalData = ({ patient, onPatientUpdated }) => {
  const datePickerRef = useRef();
  const [
    {
      showDatePicker,
      firstName,
      lastName,
      birthday,
      email,
      phoneNumber,
      isSaving,
      isPhoneValid,
      discount,
      euroDebt,
      country,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (patient != null) {
      localDispatch(actions.setPatient(patient));
    }
  }, [patient]);

  const handleFormChange = (eventId, newValue) => {
    switch (eventId) {
      case 'lastName':
        localDispatch(actions.setLastName(newValue));
        break;
      case 'firstName':
        localDispatch(actions.setFirstName(newValue));
        break;
      case 'email':
        localDispatch(actions.setEmail(newValue));
        break;
      case 'discount':
        localDispatch(actions.setDiscount(adjustValueToNumber(newValue, 100)));
        break;
      case 'euroDebt':
        localDispatch(
          actions.setEuroDebt(adjustValueToNumber(newValue, Number.MAX_VALUE)),
        );
        break;
    }
  };

  const handlePhoneChange = (value, country, event) => {
    const newNumber = value.replace(country.dialCode, '');
    const isPhoneValid = isPhoneNumberValid(value, country) && !event.target?.classList.value.includes(
      'invalid-number',
    );
    localDispatch(actions.setPhoneNumber({ newNumber, isPhoneValid, country }));
  };

  const handleBirthdayChange = (newDate) => {
    localDispatch(actions.setBirthday(newDate));
  };

  const handleOpenDatePicker = () => {
    localDispatch(actions.setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(actions.setShowDatePicker(false));
  };

  const handleSavePatient = async () => {
    if (!isFormValid()) return;
    localDispatch(actions.setIsSaving(true));

    const requestBody = {
      firstName,
      lastName,
      email,
      phoneNumber,
      euroDebt,
      countryCode: country.dialCode,
      discount: discount ? parseInt(discount) : 0,
    };

    if (birthday) {
      requestBody.birthday = moment(birthday).format('YYYY-MM-DD');
    }

    try {
      await updatePatient(patient.id, requestBody);
      await onPatientUpdated(true);
      toast.success(textForKey('Saved successfully'))
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsSaving(false));
    }
  };

  const formattedBirthday =
    birthday == null ? '' : moment(birthday).format('DD MMM YYYY');

  const isFormValid = () => {
    return (
      (email == null || email?.length === 0 || email?.match(EmailRegex)) &&
      isPhoneValid
    );
  };

  return (
    <div className={styles['patient-personal-data']}>
      {showDatePicker && (
        <EasyDatePicker
          open={showDatePicker}
          placement='bottom'
          pickerAnchor={datePickerRef.current}
          selectedDate={birthday || new Date()}
          onClose={handleCloseDatePicker}
          onChange={handleBirthdayChange}
        />
      )}
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Personal Info')}
      </Typography>
      <Box className={styles['patient-form-wrapper']}>
        <EASTextField
          type="text"
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Last name')}
          value={lastName}
          onChange={(value) => handleFormChange('lastName', value)}
        />

        <EASTextField
          type="text"
          containerClass={styles.simpleField}
          fieldLabel={textForKey('First name')}
          value={firstName}
          onChange={(value) => handleFormChange('firstName', value)}
        />

        <EASTextField
          readOnly
          ref={datePickerRef}
          value={formattedBirthday}
          onPointerUp={handleOpenDatePicker}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Birthday')}
        />

        <EASTextField
          type="email"
          value={email || ''}
          containerClass={styles.simpleField}
          error={email?.length > 0 && !email.match(EmailRegex)}
          fieldLabel={textForKey('Email')}
          onChange={(value) => handleFormChange('email', value)}
        />

        <EASTextField
          type="number"
          value={String(discount)}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Discount')}
          onChange={(value) => handleFormChange('discount', value)}
        />

        <EASTextField
          type="number"
          value={String(euroDebt)}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Euro Debt')}
          onChange={(value) => handleFormChange('euroDebt', value)}
        />

        <EASPhoneInput
          fieldLabel={textForKey('Phone number')}
          value={`+${country.dialCode}${phoneNumber}`}
          country={country.countryCode}
          placeholder={country.format}
          onChange={handlePhoneChange}
        />

        <Box
          mt='1rem'
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
        >
          <LoadingButton
            className={styles.saveButton}
            isLoading={isSaving}
            onClick={handleSavePatient}
            disabled={isSaving || !isFormValid()}
          >
            {textForKey('Save')}
            {!isSaving && <IconSuccess />}
          </LoadingButton>
        </Box>
      </Box>
    </div>
  );
};

export default PatientPersonalData;

PatientPersonalData.propTypes = {
  onPatientUpdated: PropTypes.func,
  patient: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    birthday: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    discount: PropTypes.number,
  }),
};
