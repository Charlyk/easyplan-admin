import React, { useEffect, useReducer, useRef } from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';

import { togglePatientsListUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action, EmailRegex } from '../../utils/constants';
import { generateReducerActions, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyDatePicker from '../EasyDatePicker';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './CreatePatientModal.module.scss';

const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isPhoneValid: false,
  email: '',
  isEmailValid: false,
  birthday: null,
  isLoading: false,
  showBirthdayPicker: false,
};

const reducerTypes = {
  setFirstName: 'setFirstName',
  setLastName: 'setLastName',
  setPhoneNumber: 'setPhoneNumber',
  setEmail: 'setEmail',
  setBirthday: 'setBirthday',
  setIsLoading: 'setIsLoading',
  setShowBirthdayPicker: 'setShowBirthdayPicker',
  resetState: 'resetState',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setFirstName:
      return { ...state, firstName: action.payload };
    case reducerTypes.setLastName:
      return { ...state, lastName: action.payload };
    case reducerTypes.setPhoneNumber: {
      const { phoneNumber, isPhoneValid } = action.payload;
      return { ...state, phoneNumber, isPhoneValid };
    }
    case reducerTypes.setBirthday:
      return { ...state, birthday: action.payload, showBirthdayPicker: false };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setEmail:
      return {
        ...state,
        email: action.payload,
        isEmailValid: action.payload.match(EmailRegex),
      };
    case reducerTypes.setShowBirthdayPicker:
      return { ...state, showBirthdayPicker: action.payload };
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};

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
    const requestBody = {
      firstName: firstName.length > 0 ? firstName : null,
      lastName: lastName.length > 0 ? lastName : null,
      email: email.length > 0 ? email : null,
      phoneNumber,
      birthday,
    };
    logUserAction(Action.CreatePatient, JSON.stringify(requestBody));
    const response = await dataAPI.createPatient(requestBody);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(togglePatientsListUpdate());
      onClose();
    }
    localDispatch(actions.setIsLoading(false));
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
      className='create-patient-modal'
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
        <div className='first-and-last-name'>
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
            isValid={(inputNumber, country) => {
              const phoneNumber = inputNumber.replace(
                `${country.dialCode}`,
                '',
              );
              return phoneNumber.length === 0 || phoneNumber.length === 8;
            }}
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
