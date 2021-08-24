import React, { useEffect, useReducer, useRef } from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from 'react-redux';

import { togglePatientsListUpdate } from '../../../../../redux/actions/actions';
import { textForKey } from '../../../../../utils/localization';
import EasyDatePicker from '../../../../../components/common/EasyDatePicker';
import isPhoneInputValid from "../../../../utils/isPhoneInputValid";
import EasyPlanModal from '../../../common/modals/EasyPlanModal';
import { reducer, initialState, actions } from './CreatePatientModal.reducer';
import styles from './CreatePatientModal.module.scss';

const CreatePatientModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const birthdayPickerAnchor = useRef();
  const [
    {
      firstName,
      lastName,
      phoneNumber,
      isPhoneValid,
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

  const handleSavePatient = async () => {
    if (!isFormValid) return;
    localDispatch(actions.setIsLoading(true));
    try {
      const requestBody = {
        firstName: firstName.length > 0 ? firstName : null,
        lastName: lastName.length > 0 ? lastName : null,
        email: email.length > 0 ? email : null,
        phoneNumber,
        birthday,
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

  const handlePatientDataChange = (event) => {
    const targetId = event.target.id;
    const newValue = event.target.value;
    switch (targetId) {
      case 'firstName':
        localDispatch(actions.setFirstName(newValue));
        break;
      case 'lastName':
        localDispatch(actions.setLastName(newValue));
        break;
      case 'email':
        localDispatch(actions.setEmail(newValue));
        break;
    }
  };

  const handleBirthdayChange = (newDate) => {
    localDispatch(actions.setBirthday(newDate));
  };

  const handlePhoneChange = (value, data, event) => {
    localDispatch(
      actions.setPhoneNumber({
        phoneNumber: `+${value}`,
        isPhoneValid: !event.target?.classList.value.includes('invalid-number'),
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
    <EasyPlanModal
      className={styles['create-patient-modal']}
      title={textForKey('Create patient')}
      onClose={onClose}
      open={open}
      positiveBtnText={textForKey('Create')}
      onPositiveClick={handleSavePatient}
      isPositiveLoading={isLoading}
      isPositiveDisabled={!isFormValid}
    >
      {birthdayPicker}
      <Form.Group>
        <Form.Label>{textForKey('Patient name')}</Form.Label>
        <div className={styles['first-and-last-name']}>
          <Form.Control
            id='lastName'
            value={lastName}
            onChange={handlePatientDataChange}
            placeholder={textForKey('Last name')}
          />
          <Form.Control
            id='firstName'
            value={firstName}
            onChange={handlePatientDataChange}
            placeholder={textForKey('First name')}
          />
        </div>
      </Form.Group>
      <Form.Group controlId='phoneNumber'>
        <Form.Label>{textForKey('Phone number')}</Form.Label>
        <InputGroup>
          <PhoneInput
            onChange={handlePhoneChange}
            value={phoneNumber}
            alwaysDefaultMask
            countryCodeEditable={false}
            country='md'
            placeholder='079123456'
            isValid={isPhoneInputValid}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='email'>
        <Form.Label>{textForKey('Email')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={email}
            isInvalid={email.length > 0 && !isEmailValid}
            type='email'
            onChange={handlePatientDataChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group ref={birthdayPickerAnchor}>
        <Form.Label>{textForKey('Birthday')}</Form.Label>
        <Form.Control
          value={birthday ? moment(birthday).format('DD MMM YYYY') : ''}
          readOnly
          onClick={handleOpenBirthdayPicker}
        />
      </Form.Group>
    </EasyPlanModal>
  );
};

export default CreatePatientModal;

CreatePatientModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
