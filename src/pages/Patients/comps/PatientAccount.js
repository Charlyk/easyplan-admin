import React, { useEffect, useRef, useState } from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';

import IconAvatar from '../../../assets/icons/iconAvatar';
import IconSuccess from '../../../assets/icons/iconSuccess';
import IconTrash from '../../../assets/icons/iconTrash';
import EasyDatePicker from '../../../components/EasyDatePicker';
import LoadingButton from '../../../components/LoadingButton';
import { EmailRegex } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';

const emptyPatient = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '+373',
  photo: null,
  birthday: null,
};

const PatientAccount = ({ patient, isAdding, isSaving, onSave, onDelete }) => {
  const pickerRef = useRef(null);
  const countryCode = useRef('373');
  const [patientData, setPatientData] = useState(emptyPatient);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const isPhoneValid = patient != null;
    const patientData = patient || emptyPatient;
    setPatientData({
      ...patientData,
      birthday:
        patient?.birthday != null ? moment(patient.birthday).toDate() : null,
      isPhoneValid,
    });
  }, [patient]);

  const handleFormChange = (event) => {
    setPatientData({
      ...patientData,
      [event.target.id]: event.target.value,
    });
  };

  const handleDateChange = (newDate) => {
    setPatientData({
      ...patientData,
      birthday: newDate,
    });
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const handlePhoneChange = (value, data, event) => {
    countryCode.current = data;
    setPatientData({
      ...patientData,
      phoneNumber: `+${value}`,
      isPhoneValid: !event.target.classList.value.includes('invalid-number'),
    });
  };

  const isFormValid = () => {
    return (
      (patientData.email == null ||
        patientData?.email?.length === 0 ||
        patientData?.email?.match(EmailRegex)) &&
      patientData.isPhoneValid
    );
  };

  const handleSavePatient = () => {
    onSave(patientData);
  };

  const handleDeletePatient = () => {
    onDelete(patient);
  };

  const formattedBirthday =
    patientData.birthday == null
      ? ''
      : moment(patientData.birthday).format('DD MMM YYYY');

  return (
    <div className='patients-root__account'>
      <EasyDatePicker
        open={showDatePicker}
        pickerAnchor={pickerRef.current}
        selectedDate={patientData.birthday || new Date()}
        onClose={closeDatePicker}
        onChange={handleDateChange}
      />
      <div className='patients-root__account__content'>
        <div className='patients-root__account__avatar-container'>
          {patient?.photo ? <Image roundedCircle /> : <IconAvatar />}
        </div>
        <div className='patients-root__account__data-form'>
          <Form.Group controlId='firstName'>
            <Form.Label>{textForKey('First name')}</Form.Label>
            <InputGroup>
              <Form.Control
                value={patientData.firstName}
                type='text'
                onChange={handleFormChange}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId='lastName'>
            <Form.Label>{textForKey('Last name')}</Form.Label>
            <InputGroup>
              <Form.Control
                value={patientData.lastName}
                type='text'
                onChange={handleFormChange}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group ref={pickerRef}>
            <Form.Label>{textForKey('Birthday')}</Form.Label>
            <Form.Control
              value={formattedBirthday}
              readOnly
              onClick={openDatePicker}
            />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>{textForKey('Email')}</Form.Label>
            <InputGroup>
              <Form.Control
                value={patientData?.email || ''}
                isInvalid={
                  patientData?.email?.length > 0 &&
                  !patientData.email.match(EmailRegex)
                }
                type='email'
                onChange={handleFormChange}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId='phoneNumber'>
            <Form.Label>{textForKey('Phone number')}</Form.Label>
            <InputGroup>
              <PhoneInput
                onChange={handlePhoneChange}
                value={patientData.phoneNumber}
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
        </div>
        <div className='patients-root__account__actions'>
          {!isAdding && (
            <Button className='delete-button' onClick={handleDeletePatient}>
              {textForKey('Delete')}
              <IconTrash />
            </Button>
          )}
          <LoadingButton
            className='positive-button'
            isLoading={isSaving}
            onClick={handleSavePatient}
            disabled={!isFormValid()}
          >
            {textForKey('Save')}
            {!isSaving && <IconSuccess />}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default PatientAccount;

PatientAccount.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
    birthday: PropTypes.string,
  }),
  isSaving: PropTypes.bool,
  isAdding: PropTypes.bool,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};

PatientAccount.defaultProps = {
  onSave: () => null,
  onDelete: () => null,
};
