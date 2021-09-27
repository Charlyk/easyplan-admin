import React, { useEffect, useReducer } from "react";
import PhoneInput from "react-phone-input-2";
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";
import isPhoneInputValid from "../../../../utils/isPhoneInputValid";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";
import { textForKey } from "../../../../../utils/localization";
import { EmailRegex } from "../../../../utils/constants";
import EASTextField from "../../../common/EASTextField";
import reducer, {
  initialState,
  setEmail,
  setFirstName,
  setBirthday,
  setLastName,
  setPhoneNumber,
  setContact,
} from './NewPatientForm.reducer';
import styles from './NewPatientForm.module.scss';

const NewPatientForm = ({ contact, onChange }) => {
  const [{
    firstName,
    lastName,
    phoneNumber,
    phoneCountry,
    email,
    birthday,
    isPhoneValid
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (phoneNumber.length === 0 || !isPhoneValid) {
      onChange?.(null);
      return;
    }
    onChange?.({
      firstName,
      lastName,
      phoneNumber,
      countryCode: phoneCountry.dialCode,
      emailAddress: email,
      birthday: birthday != null ? moment(birthday).format('YYYY-MM-DD') : null
    });
  }, [firstName, lastName, phoneNumber, email, birthday, isPhoneValid]);

  useEffect(() => {
    if (contact == null) {
      return;
    }
    localDispatch(setContact(contact));
  }, [contact]);

  const handleFirstNameChange = (newValue) => {
    localDispatch(setFirstName(newValue));
  };

  const handleLastNameChange = (newValue) => {
    localDispatch(setLastName(newValue));
  };

  const handleEmailChange = (newValue) => {
    localDispatch(setEmail(newValue));
  };

  const handleBirthdayChange = (newValue) => {
    localDispatch(setBirthday(moment(newValue).toDate()));
  }

  const handlePhoneChange = (value, country, event) => {
    localDispatch(setPhoneNumber({
      phoneNumber: value.replace(country.dialCode, ''),
      isPhoneValid: isPhoneNumberValid(value, country)
        && !event.target?.classList.value.includes('invalid-number'),
      country,
    }));
  };

  return (
    <div className={styles.newPatientForm}>
      <EASTextField
        id="firstName"
        type="text"
        value={lastName}
        fieldLabel={textForKey('Last name')}
        placeholder={textForKey('Last name')}
        containerClass={styles.searchField}
        onChange={handleLastNameChange}
      />

      <EASTextField
        id="lastName"
        type="text"
        value={firstName}
        fieldLabel={textForKey('First name')}
        placeholder={textForKey('First name')}
        containerClass={styles.searchField}
        onChange={handleFirstNameChange}
      />

      <Typography className={styles.formLabel}>
        {textForKey('Phone number')}
        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
      </Typography>
      <PhoneInput
        alwaysDefaultMask
        containerClass={styles.searchField}
        inputClass={styles.phoneInput}
        value={`+${phoneCountry?.dialCode}${phoneNumber}`}
        countryCodeEditable={false}
        country={phoneCountry.countryCode || 'md'}
        placeholder='79123456'
        isValid={isPhoneInputValid}
        onChange={handlePhoneChange}
      />

      <EASTextField
        id="email"
        type="email"
        value={email}
        error={email.length > 0 && !email.match(EmailRegex)}
        fieldLabel={textForKey('Email')}
        placeholder={textForKey('Email')}
        containerClass={styles.searchField}
        onChange={handleEmailChange}
      />

      <EASTextField
        id="birthday"
        type="date"
        value={birthday != null ? moment(birthday).format('YYYY-MM-DD') : ''}
        fieldLabel={textForKey('Birthday')}
        placeholder={textForKey('Birthday')}
        containerClass={styles.searchField}
        onChange={handleBirthdayChange}
      />
    </div>
  );
};

export default NewPatientForm;
