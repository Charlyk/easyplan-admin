import React, { useContext, useEffect, useReducer, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import IconSuccess from 'app/components/icons/iconSuccess';
import NotificationsContext from 'app/context/notificationsContext';
import adjustValueToNumber from 'app/utils/adjustValueToNumber';
import {
  EmailRegex,
  HeaderKeys,
  Languages,
  PatientSources,
} from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import { requestUpdatePatient } from 'middleware/api/patients';
import {
  requestAssignTag,
  requestFetchTags,
  requestUnassignTag,
} from 'middleware/api/tags';
import { calendarScheduleDetailsSelector } from 'redux/selectors/scheduleSelector';
import {
  updateSchedulePatientRecords,
  updateDetailsPatientRecords,
} from 'redux/slices/calendarData';
import { ReduxDispatch } from 'store';
import { CurrentClinic } from 'types/currentClinic.type';
import { Patient } from 'types/patient.type';
import styles from './PatientPersonalData.module.scss';
import reducer, {
  initialState,
  setFirstName,
  setShowDatePicker,
  setPatient,
  setIsSaving,
  setPhoneNumber,
  setLastName,
  setBirthday,
  setDiscount,
  setEuroDebt,
  setSource,
  setLanguage,
  setEmail,
  setAllTags,
  removeTag,
  addPatientTag,
} from './PatientPersonalData.reducer';

const EasyDatePicker = dynamic(
  () => import('app/components/common/EasyDatePicker'),
);

interface Props {
  patient: Patient;
  currentClinic: CurrentClinic;
  authToken: string;
  onPatientUpdated: (val: boolean) => void;
}

const PatientPersonalData: React.FC<Props> = ({
  patient,
  currentClinic,
  authToken,
  onPatientUpdated,
}) => {
  const dispatch = useDispatch<ReduxDispatch>();
  const didInitialRenderHappen = useRef<boolean>(false);
  const scheduleDetails = useSelector(calendarScheduleDetailsSelector);
  const datePickerRef = useRef<HTMLDivElement | null>();
  const toast = useContext(NotificationsContext);
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
      language,
      source,
      allTags,
      tags,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllTags();
  }, []);

  useEffect(() => {
    if (patient != null) {
      localDispatch(setPatient(patient));
      if (didInitialRenderHappen.current) {
        dispatch(
          updateSchedulePatientRecords({
            id: patient.id,
            fullName: patient.fullName,
          }),
        );

        if (patient.id === scheduleDetails?.patient.id) {
          dispatch(updateDetailsPatientRecords(patient));
        }
      }
      didInitialRenderHappen.current = true;
    }
  }, [patient]);

  const fetchAllTags = async () => {
    try {
      const response = await requestFetchTags();
      localDispatch(setAllTags(response.data));
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleFormChange = (eventId, newValue) => {
    switch (eventId) {
      case 'lastName':
        localDispatch(setLastName(newValue));
        break;
      case 'firstName':
        localDispatch(setFirstName(newValue));
        break;
      case 'email':
        localDispatch(setEmail(newValue));
        break;
      case 'discount':
        localDispatch(setDiscount(adjustValueToNumber(newValue, 100)));
        break;
      case 'euroDebt':
        localDispatch(
          setEuroDebt(adjustValueToNumber(newValue, Number.MAX_VALUE)),
        );
        break;
    }
  };

  const handlePhoneChange = (value, country, event) => {
    const newNumber = value.replace(country.dialCode, '');
    const isPhoneValid =
      isPhoneNumberValid(value, country) &&
      !event.target?.classList.value.includes('invalid-number');
    localDispatch(setPhoneNumber({ newNumber, isPhoneValid, country }));
  };

  const handleBirthdayChange = (newDate) => {
    localDispatch(setBirthday(newDate));
  };

  const handleOpenDatePicker = () => {
    localDispatch(setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(setShowDatePicker(false));
  };

  const handleSourceChange = (event) => {
    localDispatch(setSource(event.target.value));
  };

  const handleTagsChange = (event) => {
    const newValue = event.target.value;
    if (!newValue) {
      return;
    }
    const newTag = allTags.find((item) => item.id === parseInt(newValue));
    if (newTag != null) {
      handleAssignTag(newTag);
    }
  };

  const handleAssignTag = async (tag) => {
    try {
      await requestAssignTag(tag.id, patient.id);
      localDispatch(addPatientTag(tag));
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleDeleteTag = async (tag) => {
    try {
      await requestUnassignTag(tag.id, patient.id);
      localDispatch(removeTag(tag));
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleLanguageChange = (event) => {
    localDispatch(setLanguage(event.target.value));
  };

  const handleSavePatient = async () => {
    if (!isFormValid()) return;
    localDispatch(setIsSaving(true));

    const requestBody = {
      firstName,
      lastName,
      email,
      phoneNumber,
      language,
      source,
      euroDebt,
      birthday: birthday ? moment(birthday).format('YYYY-MM-DD') : null,
      countryCode: country.dialCode,
      discount: discount ? parseInt(`${discount}`) : 0,
    };

    try {
      await requestUpdatePatient(patient.id, requestBody, null, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      await onPatientUpdated(true);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsSaving(false));
    }
  };

  const formattedBirthday =
    birthday == null ? '' : moment(birthday).format('DD MMM YYYY');

  const isFormValid = (): boolean => {
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
          disablePortal={true}
          minDate={null}
        />
      )}
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Personal Info')}
      </Typography>
      <Box className={styles['patient-form-wrapper']}>
        <EASTextField
          type='text'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Last name')}
          value={lastName}
          onChange={(value) => handleFormChange('lastName', value)}
        />

        <EASTextField
          type='text'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('First name')}
          value={firstName}
          onChange={(value) => handleFormChange('firstName', value)}
        />

        <EASTextField
          readOnly
          ref={datePickerRef}
          value={formattedBirthday}
          onPointerUp={handleOpenDatePicker}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Birthday')}
        />

        <EASTextField
          type='email'
          value={email || ''}
          containerClass={styles.simpleField}
          error={email?.length > 0 && !email.match(EmailRegex)}
          fieldLabel={textForKey('Email')}
          onChange={(value) => handleFormChange('email', value)}
        />

        <EASTextField
          type='number'
          value={String(discount)}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Discount')}
          onChange={(value) => handleFormChange('discount', value)}
        />

        <EASTextField
          type='number'
          value={String(euroDebt)}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Euro Debt')}
          onChange={(value) => handleFormChange('euroDebt', value)}
        />

        <EASPhoneInput
          rootClass={styles.simpleField}
          fieldLabel={textForKey('Phone number')}
          value={`+${country.dialCode}${phoneNumber}`}
          country={country.countryCode}
          placeholder={country.format}
          onChange={handlePhoneChange}
        />

        <EASSelect
          label={textForKey('spoken_language')}
          labelId='spoken-language-select'
          options={Languages}
          value={language}
          rootClass={styles.simpleField}
          onChange={handleLanguageChange}
        />

        <EASSelect
          label={textForKey('patient_source')}
          labelId='patient-source-select'
          options={PatientSources}
          value={source}
          rootClass={styles.simpleField}
          onChange={handleSourceChange}
        />

        <EASSelect
          label={textForKey('add_tag_to_patient')}
          labelId='patient-source-select'
          options={allTags}
          value={[]}
          rootClass={styles.simpleField}
          onChange={handleTagsChange}
        />

        <div className={styles.tagsContainer}>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.title}
              variant='outlined'
              classes={{
                root: styles.tag,
                outlined: styles.outlined,
                label: styles.label,
                deleteIcon: styles.deleteIcon,
              }}
              onDelete={() => handleDeleteTag(tag)}
            />
          ))}
        </div>

        <Box
          mt='1rem'
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
        >
          <LoadingButton
            className={styles.saveButton}
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
