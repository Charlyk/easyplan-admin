import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useMemo,
} from 'react';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch } from 'react-redux';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import NotificationsContext from 'app/context/notificationsContext';
import {
  EmailRegex,
  HeaderKeys,
  Languages,
  PatientSources as rawPatientSources,
} from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import { requestCreatePatient } from 'middleware/api/patients';
import { toggleUpdatePatients } from 'redux/slices/mainReduxSlice';
import useMappedValue from '../../../../utils/hooks/useMappedValue';
import EASModal from '../../../common/modals/EASModal';
import styles from './CreatePatientModal.module.scss';
import { reducer, initialState, actions } from './CreatePatientModal.reducer';

const EasyDatePicker = dynamic(() =>
  import('app/components/common/EasyDatePicker'),
);

const CreatePatientModal = ({ open, currentClinic, authToken, onClose }) => {
  const textForKey = useTranslate();
  const patientSources = useMappedValue(rawPatientSources);
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const birthdayPickerAnchor = useRef();
  const [
    {
      firstName,
      lastName,
      phoneNumber,
      isPhoneValid,
      phoneCountry,
      language,
      source,
      email,
      isEmailValid,
      birthday,
      isLoading,
      showBirthdayPicker,
      idnp,
      identityCardSeries,
      address,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const isFormValid = (email.length === 0 || isEmailValid) && isPhoneValid;
  const isEmailFieldValid = email.length === 0 || email.match(EmailRegex);

  const mappedPatientSources = useMemo(() => {
    return PatientSources.map((source) => ({
      ...source,
      name: textForKey(source.name),
    }));
  }, []);

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
        birthday: moment(birthday).format('YYYY-MM-DD'),
        phoneNumber,
        language,
        source,
        firstName: firstName.length > 0 ? firstName : null,
        lastName: lastName.length > 0 ? lastName : null,
        email: email.length > 0 ? email : null,
        countryCode: phoneCountry.dialCode,
        personalId: idnp,
        homeAddress: address,
        identityCard: identityCardSeries,
      };
      await requestCreatePatient(requestBody, null, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      dispatch(toggleUpdatePatients(true));
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

  const handleIdnpChange = (value) => {
    localDispatch(actions.setIDNP(value));
  };

  const handleIdentityCardSeriesChange = (value) => {
    localDispatch(actions.setIdentityCardSeries(value));
  };

  const handleAddressChange = (value) => {
    localDispatch(actions.setAddress(value));
  };

  const handlePhoneChange = (value, country, event) => {
    localDispatch(
      actions.setPhoneNumber({
        phoneNumber: value.replace(country.dialCode, ''),
        isPhoneValid:
          isPhoneNumberValid(value, country) &&
          !event.target?.classList.value.includes('invalid-number'),
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

  const handleLanguageChange = (event) => {
    localDispatch(actions.setLanguage(event.target.value));
  };

  const handleSourceChange = (event) => {
    localDispatch(actions.setSource(event.target.value));
  };

  const birthdayPicker = (
    <EasyDatePicker
      placement='bottom'
      open={showBirthdayPicker}
      maxDate={new Date()}
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
      title={textForKey('create patient')}
      onClose={onClose}
      open={open}
      primaryBtnText={textForKey('create')}
      onPrimaryClick={handleSavePatient}
      isPositiveLoading={isLoading}
      isPositiveDisabled={!isFormValid}
    >
      {birthdayPicker}
      <form onSubmit={handleSavePatient} className={styles.formContainer}>
        <div className={styles['first-and-last-name']}>
          <EASTextField
            type='text'
            containerClass={styles.nameField}
            fieldLabel={textForKey('last name')}
            value={lastName}
            onChange={handlePatientLastNameChange}
          />
          <EASTextField
            type='text'
            containerClass={styles.nameField}
            fieldLabel={textForKey('first name')}
            value={firstName}
            onChange={handlePatientFirstNameChange}
          />
        </div>

        <EASPhoneInput
          rootClass={styles.simpleField}
          fieldLabel={textForKey('phone number')}
          value={`+${phoneCountry?.dialCode}${phoneNumber}`}
          country={phoneCountry.countryCode || 'md'}
          onChange={handlePhoneChange}
        />

        <EASTextField
          type='email'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('email')}
          value={email}
          error={!isEmailFieldValid}
          helperText={
            isEmailFieldValid ? null : textForKey('email_invalid_message')
          }
          onChange={handlePatientEmailChange}
        />
        <EASTextField
          fieldLabel={textForKey('identity_card')}
          containerClass={styles.simpleField}
          onChange={handleIdentityCardSeriesChange}
          value={identityCardSeries}
        />
        <EASTextField
          fieldLabel={textForKey('idnp')}
          containerClass={styles.simpleField}
          onChange={handleIdnpChange}
          value={idnp}
        />

        <EASTextField
          readOnly
          ref={birthdayPickerAnchor}
          fieldLabel={textForKey('birthday')}
          value={birthday ? moment(birthday).format('DD MMM YYYY') : ''}
          onPointerUp={handleOpenBirthdayPicker}
        />

        <EASSelect
          label={textForKey('spoken_language')}
          labelId='spoken-language-select'
          options={Languages}
          value={language}
          rootClass={styles.simpleField}
          onChange={handleLanguageChange}
        />
        <EASTextField
          fieldLabel={textForKey('address')}
          containerClass={styles.simpleField}
          onChange={handleAddressChange}
          value={address}
        />
        <EASSelect
          label={textForKey('patient_source')}
          labelId='patient-source-select'
          options={patientSources}
          value={source}
          rootClass={styles.simpleField}
          onChange={handleSourceChange}
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
