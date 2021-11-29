import React, { useEffect, useMemo, useReducer } from 'react';
import moment from 'moment-timezone';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import { EmailRegex, Languages, PatientSources } from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import { textForKey } from 'app/utils/localization';
import styles from './NewPatientForm.module.scss';
import reducer, {
  initialState,
  setEmail,
  setFirstName,
  setBirthday,
  setLastName,
  setPhoneNumber,
  setContact,
  setLanguage,
  setPatientSource,
} from './NewPatientForm.reducer';

const NewPatientForm = ({ deal, onChange }) => {
  const [
    {
      firstName,
      lastName,
      phoneNumber,
      phoneCountry,
      email,
      birthday,
      language,
      source,
      isPhoneValid,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const phoneNumberValue = useMemo(() => {
    if (phoneNumber?.startsWith(phoneCountry?.dialCode)) {
      return phoneNumber?.replace(phoneCountry?.dialCode, '');
    }
    return phoneNumber;
  }, [phoneNumber, phoneCountry]);

  useEffect(() => {
    if (phoneNumberValue.length === 0 || !isPhoneValid) {
      onChange?.(null);
      return;
    }
    onChange?.({
      firstName,
      lastName,
      phoneNumber: phoneNumberValue,
      countryCode: phoneCountry.dialCode,
      emailAddress: email,
      birthday: birthday != null ? moment(birthday).format('YYYY-MM-DD') : null,
      language: language.id,
      source: source.id,
    });
  }, [
    firstName,
    lastName,
    phoneNumberValue,
    email,
    birthday,
    isPhoneValid,
    source,
    language,
  ]);

  useEffect(() => {
    if (deal?.contact == null) {
      return;
    }
    localDispatch(setContact(deal.contact));
  }, [deal]);

  useEffect(() => {
    if (deal == null) {
      return;
    }

    if (deal.source === 'Facebook') {
      localDispatch(setPatientSource({ id: 'Facebook', name: 'Facebook' }));
    } else if (deal.source === 'Instagram') {
      localDispatch(setPatientSource({ id: 'Instagram', name: 'Instagram' }));
    }
  }, [deal]);

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
  };

  const handlePhoneChange = (value, country, event) => {
    localDispatch(
      setPhoneNumber({
        phoneNumber: value.replace(country.dialCode, ''),
        isPhoneValid:
          isPhoneNumberValid(value, country) &&
          !event.target?.classList.value.includes('invalid-number'),
        country,
      }),
    );
  };

  const handleLanguageChange = (event) => {
    const newValue = event.target.value;
    const newLanguage = Languages.find((item) => item.id === newValue);
    localDispatch(setLanguage(newLanguage));
  };

  const handleSourceChange = (event) => {
    const newValue = event.target.value;
    const newSource = PatientSources.find((item) => item.id === newValue);
    localDispatch(setPatientSource(newSource));
  };

  return (
    <div className={styles.newPatientForm}>
      <EASTextField
        id='firstName'
        type='text'
        value={lastName}
        fieldLabel={textForKey('Last name')}
        placeholder={textForKey('Last name')}
        containerClass={styles.searchField}
        onChange={handleLastNameChange}
      />

      <EASTextField
        id='lastName'
        type='text'
        value={firstName}
        fieldLabel={textForKey('First name')}
        placeholder={textForKey('First name')}
        containerClass={styles.searchField}
        onChange={handleFirstNameChange}
      />

      <EASPhoneInput
        fieldLabel={textForKey('Phone number')}
        rootClass={styles.searchField}
        country={phoneCountry.countryCode || 'md'}
        value={`+${phoneCountry?.dialCode}${phoneNumberValue}`}
        onChange={handlePhoneChange}
      />

      <EASTextField
        id='email'
        type='email'
        value={email}
        error={email.length > 0 && !email.match(EmailRegex)}
        fieldLabel={textForKey('Email')}
        placeholder={textForKey('Email')}
        containerClass={styles.searchField}
        onChange={handleEmailChange}
      />

      <EASTextField
        id='birthday'
        type='date'
        value={birthday != null ? moment(birthday).format('YYYY-MM-DD') : ''}
        fieldLabel={textForKey('Birthday')}
        placeholder={textForKey('Birthday')}
        containerClass={styles.searchField}
        onChange={handleBirthdayChange}
      />

      <EASSelect
        label={textForKey('spoken_language')}
        labelId='spoken-language-select'
        options={Languages}
        value={language.id}
        rootClass={styles.searchField}
        onChange={handleLanguageChange}
      />

      <EASSelect
        label={textForKey('patient_source')}
        labelId='patient-source-select'
        options={PatientSources}
        value={source.id}
        rootClass={styles.searchField}
        onChange={handleSourceChange}
      />
    </div>
  );
};

export default NewPatientForm;
