import React, { useEffect, useReducer, useRef } from 'react';

import { Box, Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';

import IconSuccess from '../../../icons/iconSuccess';
import { EmailRegex } from '../../../../utils/constants';
import {
  adjustValueToNumber,
  generateReducerActions,
} from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import EasyDatePicker from '../../../common/EasyDatePicker';
import LoadingButton from '../../../common/LoadingButton';
import styles from '../../../../styles/PatientPersonalData.module.scss'
import { toast } from "react-toastify";
import axios from "axios";
import { baseAppUrl } from "../../../../eas.config";

const initialState = {
  isSaving: false,
  showDatePicker: false,
  firstName: '',
  lastName: '',
  birthday: null,
  email: '',
  phoneNumber: '',
  discount: 0,
  euroDebt: 0,
};

const reducerTypes = {
  setFirstName: 'setFirstName',
  setLastName: 'setLastName',
  setBirthday: 'setBirthday',
  setEmail: 'setEmail',
  setPhoneNumber: 'setPhoneNumber',
  setShowDatePicker: 'setShowDatePicker',
  setPatient: 'setPatient',
  setIsSaving: 'setIsSaving',
  setDiscount: 'setDiscount',
  setEuroDebt: 'setEuroDebt',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setFirstName:
      return { ...state, firstName: action.payload };
    case reducerTypes.setLastName:
      return { ...state, lastName: action.payload };
    case reducerTypes.setBirthday:
      return { ...state, birthday: action.payload, showDatePicker: false };
    case reducerTypes.setEmail:
      return { ...state, email: action.payload };
    case reducerTypes.setPhoneNumber: {
      const { isPhoneValid, newNumber } = action.payload;
      return { ...state, phoneNumber: newNumber, isPhoneValid };
    }
    case reducerTypes.setDiscount:
      return { ...state, discount: action.payload };
    case reducerTypes.setEuroDebt:
      return { ...state, euroDebt: action.payload };
    case reducerTypes.setPatient: {
      const {
        firstName,
        lastName,
        birthday,
        email,
        phoneNumber,
        discount,
        euroDebt,
      } = action.payload;
      return {
        ...state,
        firstName,
        lastName,
        birthday: birthday ? moment(birthday).toDate() : null,
        email,
        phoneNumber,
        euroDebt,
        discount: String(discount || '0'),
        isPhoneValid: true,
      };
    }
    case reducerTypes.setIsSaving:
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};

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
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (patient != null) {
      localDispatch(actions.setPatient(patient));
    }
  }, [patient]);

  const handleFormChange = (event) => {
    const eventId = event.target.id;
    const newValue = event.target.value;
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

  const handlePhoneChange = (value, data, event) => {
    const newNumber = `+${value}`;
    const isPhoneValid = !event.target?.classList.value.includes(
      'invalid-number',
    );
    localDispatch(actions.setPhoneNumber({ newNumber, isPhoneValid }));
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
      birthday,
      euroDebt,
      discount: discount ? parseInt(discount) : 0,
    };

    try {
      await axios.put(`${baseAppUrl}/api/patients/${patient.id}`, requestBody);
      await onPatientUpdated(true);
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
        <Form.Group controlId='lastName'>
          <Form.Label>{textForKey('Last name')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={lastName}
              type='text'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='firstName'>
          <Form.Label>{textForKey('First name')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={firstName}
              type='text'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group ref={datePickerRef}>
          <Form.Label>{textForKey('Birthday')}</Form.Label>
          <Form.Control
            value={formattedBirthday}
            readOnly
            onClick={handleOpenDatePicker}
          />
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={email || ''}
              isInvalid={email?.length > 0 && !email.match(EmailRegex)}
              type='email'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='discount'>
          <Form.Label>{textForKey('Discount')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={String(discount)}
              type='number'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='euroDebt'>
          <Form.Label>{textForKey('Euro Debt')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={String(euroDebt)}
              type='number'
              onChange={handleFormChange}
            />
          </InputGroup>
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
        <Box
          mt='1rem'
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
        >
          <LoadingButton
            className='positive-button'
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
