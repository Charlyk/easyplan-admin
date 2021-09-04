import React, { useEffect, useReducer, useRef } from 'react';
import dynamic from 'next/dynamic';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import PhoneInput from 'react-phone-input-2';
import { toast } from "react-toastify";

import IconSuccess from '../../../../icons/iconSuccess';
import { EmailRegex } from '../../../../../utils/constants';
import adjustValueToNumber from '../../../../../../utils/adjustValueToNumber';
import { textForKey } from '../../../../../../utils/localization';
import LoadingButton from '../../../../../../components/common/LoadingButton';
import { actions, initialState, reducer } from './PatientPersonalData.reducer';
import { updatePatient } from "../../../../../../middleware/api/patients";
import isPhoneInputValid from "../../../../../utils/isPhoneInputValid";
import isPhoneNumberValid from "../../../../../utils/isPhoneNumberValid";
import styles from './PatientPersonalData.module.scss';

const EasyDatePicker = dynamic(() => import('../../../../../../components/common/EasyDatePicker'));

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
              alwaysDefaultMask
              value={`+${country.dialCode}${phoneNumber}`}
              countryCodeEditable={false}
              country={country.countryCode}
              placeholder={country.format}
              isValid={isPhoneInputValid}
              onChange={handlePhoneChange}
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
