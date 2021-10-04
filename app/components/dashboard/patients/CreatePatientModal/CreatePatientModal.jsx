import React, { useEffect, useReducer, useRef } from 'react';
import axios from "axios";
import dynamic from 'next/dynamic';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import PhoneInput from 'react-phone-input-2';
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';

import { togglePatientsListUpdate } from '../../../../../redux/actions/actions';
import { textForKey } from '../../../../../utils/localization';
import isPhoneInputValid from "../../../../utils/isPhoneInputValid";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";
import EasyPlanModal from '../../../common/modals/EasyPlanModal';
import { reducer, initialState, actions } from './CreatePatientModal.reducer';
import styles from './CreatePatientModal.module.scss';
import EASModal from "../../../common/modals/EASModal";
import EASTextField from "../../../common/EASTextField";
import EASPhoneInput from "../../../common/EASPhoneInput";

const EasyDatePicker = dynamic(() => import('../../../common/EasyDatePicker'));

const CreatePatientModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const birthdayPickerAnchor = useRef();
  const [
    {
      firstName,
      lastName,
      phoneNumber,
      isPhoneValid,
      phoneCountry,
      email,
      isEmailValid,
      birthday,
      isLoading,
      showBirthdayPicker,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const isFormValid = (email.length === 0 || isEmailValid) && isPhoneValid;

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  const handleSavePatient = async (event) => {
    event?.preventDefault();
    if (!isFormValid) return;
    localDispatch(actions.setIsLoading(true));
    try {
      const requestBody = {
        birthday,
        phoneNumber,
        firstName: firstName.length > 0 ? firstName : null,
        lastName: lastName.length > 0 ? lastName : null,
        email: email.length > 0 ? email : null,
        countryCode: phoneCountry.dialCode,
      };
      await axios.post(`/api/patients`, requestBody);
      dispatch(togglePatientsListUpdate(true));
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  const handlePatientEmailChange = (newValue) => {
    localDispatch(actions.setEmail(newValue));
  };

  const handlePatientLastNameChange = (newValue) => {
    localDispatch(actions.setLastName(newValue));
  };

  const handlePatientFirstNameChange = (newValue) => {
    localDispatch(actions.setFirstName(newValue));
  };

  const handleBirthdayChange = (newDate) => {
    localDispatch(actions.setBirthday(newDate));
  };

  const handlePhoneChange = (value, country, event) => {
    localDispatch(
      actions.setPhoneNumber({
        phoneNumber: value.replace(country.dialCode, ''),
        isPhoneValid: isPhoneNumberValid(value, country) && !event.target?.classList.value.includes('invalid-number'),
        country,
      }),
    );
  };

  const handleOpenBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(true));
  };

  const handleCloseBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(false));
  };

  const birthdayPicker = (
    <EasyDatePicker
      placement='bottom'
      open={showBirthdayPicker}
      pickerAnchor={birthdayPickerAnchor.current}
      onChange={handleBirthdayChange}
      onClose={handleCloseBirthdayPicker}
      selectedDate={birthday || new Date()}
    />
  );

  return (
    <EASModal
      className={styles['create-patient-modal']}
      paperClass={styles.modalPaper}
      title={textForKey('Create patient')}
      onClose={onClose}
      open={open}
      primaryBtnText={textForKey('Create')}
      onPrimaryClick={handleSavePatient}
      isPositiveLoading={isLoading}
      isPositiveDisabled={!isFormValid}
    >
      {birthdayPicker}
      <form onSubmit={handleSavePatient} className={styles.formContainer}>
        <div className={styles['first-and-last-name']}>
          <EASTextField
            type="text"
            containerClass={styles.nameField}
            fieldLabel={textForKey('Last name')}
            value={lastName}
            onChange={handlePatientLastNameChange}
          />
          <EASTextField
            type="text"
            containerClass={styles.nameField}
            fieldLabel={textForKey('First name')}
            value={firstName}
            onChange={handlePatientFirstNameChange}
          />
        </div>

        <EASPhoneInput
          rootClass={styles.simpleField}
          fieldLabel={textForKey('Phone number')}
          value={`+${phoneCountry?.dialCode}${phoneNumber}`}
          country={phoneCountry.countryCode || 'md'}
          onChange={handlePhoneChange}
        />

        <EASTextField
          type="email"
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Email')}
          value={email}
          error={email.length > 0 && !isEmailValid}
          onChange={handlePatientEmailChange}
        />

        <EASTextField
          readOnly
          ref={birthdayPickerAnchor}
          fieldLabel={textForKey('Birthday')}
          value={birthday ? moment(birthday).format('DD MMM YYYY') : ''}
          onPointerUp={handleOpenBirthdayPicker}
        />
      </form>
    </EASModal>
  );
};

export default CreatePatientModal;

CreatePatientModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
