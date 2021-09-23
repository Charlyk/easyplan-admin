import React, { useEffect, useReducer } from "react";
import PhoneInput from "react-phone-input-2";
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";
import isPhoneInputValid from "../../../../utils/isPhoneInputValid";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";
import { textForKey } from "../../../../../utils/localization";
import EASTextField from "../../../common/EASTextField";
import reducer, {
  initialState,
  setEmail,
  setFirstName,
  setBirthday,
  setLastName,
  setPhoneNumber,
} from './NewPatientForm.reducer';
import styles from './NewPatientForm.module.scss';
import { EmailRegex } from "../../../../utils/constants";
import DatePicker from "@material-ui/pickers/DatePicker";

const NewPatientForm = ({ onChange }) => {
  const [{
    firstName,
    lastName,
    phoneNumber,
    phoneCountry,
    email,
    birthday
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    onChange?.({
      firstName,
      lastName,
      phoneNumber,
      email,
      birthday: moment(birthday).format('YYYY-MM-DD'),
      countryCode: phoneCountry.dialCode
    });
  }, [firstName, lastName, phoneNumber, email, birthday]);

  const handleFirstNameChange = (newValue) => {
    localDispatch(setFirstName(newValue));
  };

  const handleLastNameChange = (newValue) => {
    localDispatch(setLastName(newValue));
  };

  const handleEmailChange = (newValue) => {
    localDispatch(setEmail(newValue));
  };

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
        value={lastName}
        fieldLabel={textForKey('Last name')}
        placeholder={textForKey('Last name')}
        containerClass={styles.searchField}
        onChange={handleLastNameChange}
      />

      <EASTextField
        value={firstName}
        fieldLabel={textForKey('First name')}
        placeholder={textForKey('First name')}
        containerClass={styles.searchField}
        onChange={handleFirstNameChange}
      />

      <Typography className={styles.formLabel}>
        {textForKey('Phone number')}
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
        value={email}
        error={email.length > 0 && !email.match(EmailRegex)}
        fieldLabel={textForKey('Email')}
        placeholder={textForKey('Email')}
        containerClass={styles.searchField}
        onChange={handleEmailChange}
      />
    </div>
  );
};

export default NewPatientForm;
