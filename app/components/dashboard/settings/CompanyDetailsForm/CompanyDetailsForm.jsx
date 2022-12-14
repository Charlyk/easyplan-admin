import React, { useContext, useEffect, useMemo, useReducer } from 'react';
import sortBy from 'lodash/sortBy';
import upperFirst from 'lodash/upperFirst';
import dynamic from 'next/dynamic';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASSelect from 'app/components/common/EASSelect';
import EASTextarea from 'app/components/common/EASTextarea';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import UploadAvatar from 'app/components/common/UploadAvatar';
import IconLogoPlaceholder from 'app/components/icons/iconLogoPlaceholder';
import IconSuccess from 'app/components/icons/iconSuccess';
import IconTrash from 'app/components/icons/iconTrash';
import NotificationsContext from 'app/context/notificationsContext';
import { EmailRegex, HeaderKeys } from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import onRequestFailed from 'app/utils/onRequestFailed';
import {
  clinicTimeZones,
  deleteClinic,
  updateClinic,
} from 'middleware/api/clinic';
import {
  authTokenSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import { setCurrentClinic } from 'redux/slices/appDataSlice';
import styles from './CompanyDetailsForm.module.scss';
import reducer, {
  initialState,
  setIsSaving,
  setTimeZones,
  setData,
  setIsDeleting,
  closeDeleteConfirmation,
  closeDeleteRequestSent,
  openDeleteRequestSent,
  openDeleteConfirmation,
} from './CompanyDetailsForm.reducer';

const ConfirmationModal = dynamic(() =>
  import('../../../common/modals/ConfirmationModal'),
);

const CompanyDetailsForm = ({ countries }) => {
  const textForKey = useTranslate();
  const toast = useContext(NotificationsContext);
  const dispatch = useDispatch();
  const currentClinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const [
    {
      isSaving,
      isDeleting,
      showDeleteRequestSent,
      deleteModal,
      timeZones,
      data,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const phoneCountry = useMemo(() => {
    return currentClinic.country.slice(0, 2);
  }, [currentClinic.country]);

  const mappedCountries = useMemo(() => {
    return countries.map((item) => ({
      ...item,
      id: item.iso,
    }));
  }, [countries]);

  const mappedTimeZones = useMemo(() => {
    return sortBy(
      timeZones.map((item) => ({
        id: item,
        name: item,
      })),
      (item) => item.name,
    );
  }, [timeZones]);

  useEffect(() => {
    fetchTimeZones();
  }, []);

  useEffect(() => {
    localDispatch(
      setData({
        ...data,
        ...currentClinic,
        allCurrencies: currentClinic.allCurrencies.map((item) => ({
          ...item,
          name: `${item.id} - ${item.name}`,
        })),
      }),
    );
  }, [currentClinic]);

  const fetchTimeZones = async () => {
    try {
      localDispatch(setIsSaving(true));
      const response = await clinicTimeZones();
      localDispatch(setTimeZones(response.data));
    } catch (error) {
      onRequestFailed(error, toast);
      localDispatch(setIsSaving(false));
    }
  };

  const handleLogoChange = (file) => {
    if (isSaving) return;
    if (file != null) {
      localDispatch(setData({ ...data, logoFile: file }));
    }
  };

  const handleFormChange = (fieldId, value) => {
    if (isSaving) return;
    localDispatch(
      setData({
        ...data,
        [fieldId]: value,
      }),
    );
  };

  const handleTimeZoneChange = (event) => {
    handleFormChange('timeZone', event.target.value);
  };

  const handleDescriptionChange = (newValue) => {
    handleFormChange('description', newValue);
  };

  const handleCurrencyChange = (event) => {
    handleFormChange('currency', event.target.value);
  };

  const handleClinicNameChange = (newValue) => {
    handleFormChange('clinicName', newValue);
  };

  const handleEmailChange = (newValue) => {
    handleFormChange('email', newValue);
  };

  const handleWebsiteChange = (newValue) => {
    handleFormChange('website', newValue);
  };

  const handleCountryChange = (event) => {
    handleFormChange('country', event.target.value);
  };

  const handlePhoneChange = (phoneType) => (value, country, event) => {
    const validationFieldName = `isValid${upperFirst(phoneType)}`;
    if (isSaving) return;
    localDispatch(
      setData({
        ...data,
        [phoneType]: `+${value}`,
        [validationFieldName]:
          isPhoneNumberValid(value, country) &&
          !event.target?.classList.value.includes('invalid-number'),
      }),
    );
  };

  const handleStartDelete = () => {
    localDispatch(openDeleteConfirmation());
  };

  const handleCloseDelete = () => {
    localDispatch(closeDeleteConfirmation());
  };

  const handleConfirmDelete = async () => {
    try {
      localDispatch(setIsDeleting(true));
      await deleteClinic();
      localDispatch(openDeleteRequestSent());
    } catch (error) {
      onRequestFailed(error, toast);
    } finally {
      localDispatch(setIsDeleting(false));
    }
  };

  const handleCloseDeleteRequestSent = () => {
    localDispatch(closeDeleteRequestSent());
  };

  const isFormValid = () => {
    return (
      data.clinicName?.length > 3 &&
      (data.phoneNumber == null ||
        data.phoneNumber.length === 0 ||
        data.isValidPhoneNumber) &&
      (data.telegramNumber == null ||
        data.telegramNumber.length === 0 ||
        data.isValidTelegramNumber) &&
      (data.viberNumber == null ||
        data.viberNumber.length === 0 ||
        data.isValidViberNumber) &&
      (data.whatsappNumber == null ||
        data.whatsappNumber.length === 0 ||
        data.isValidWhatsappNumber) &&
      (data.email == null ||
        data.email.length === 0 ||
        data.email.match(EmailRegex))
    );
  };

  const submitForm = async () => {
    if (!isFormValid()) return;
    try {
      localDispatch(setIsSaving(true));
      const requestBody = {
        id: data.id,
        clinicName: data.clinicName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        telegramNumber: data.telegramNumber,
        viberNumber: data.viberNumber,
        whatsappNumber: data.whatsappNumber,
        website: data.website,
        currency: data.currency,
        country: data.country,
        description: data.description,
        workdays: data.workdays,
        hasBrackets: data.hasBrackets,
        timeZone: data.timeZone,
      };
      const response = await updateClinic(requestBody, data.logoFile, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      dispatch(setCurrentClinic(response.data));
      toast.success(textForKey('saved successfully'));
    } catch (error) {
      onRequestFailed(error, toast);
    } finally {
      localDispatch(setIsSaving(false));
    }
  };

  const logoSrc =
    (data.logoFile && window.URL.createObjectURL(data.logoFile)) ||
    (data.logoUrl ? data.logoUrl : null);

  return (
    <div className={styles.companyDetailsForm}>
      <ConfirmationModal
        show={showDeleteRequestSent}
        title={textForKey('clinic_delete_requested')}
        message={textForKey('clinic_delete_requested_message')}
        onClose={handleCloseDeleteRequestSent}
      />
      <ConfirmationModal
        show={deleteModal.open}
        isLoading={isDeleting}
        title={textForKey('delete clinic')}
        message={textForKey('delete_clinic_message')}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
      <span className={styles.formTitle}>{textForKey('company details')}</span>
      <UploadAvatar
        currentAvatar={data.logoFile || logoSrc}
        placeholder={<IconLogoPlaceholder />}
        onChange={handleLogoChange}
      />

      <div className={styles.dataWrapper}>
        <div className={styles.left}>
          <EASTextField
            type='text'
            containerClass={styles.simpleField}
            fieldLabel={textForKey('clinic name')}
            value={data.clinicName}
            onChange={handleClinicNameChange}
          />

          <EASTextField
            type='email'
            containerClass={styles.simpleField}
            fieldLabel={textForKey('email')}
            value={data.email}
            onChange={handleEmailChange}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.phoneNumber || ''}
            fieldLabel={textForKey('phone number')}
            onChange={handlePhoneChange('phoneNumber')}
            country={phoneCountry}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.telegramNumber || ''}
            fieldLabel={'Telegram'}
            onChange={handlePhoneChange('telegramNumber')}
            country={phoneCountry}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.viberNumber || ''}
            fieldLabel={'Viber'}
            onChange={handlePhoneChange('viberNumber')}
            country={phoneCountry}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.whatsappNumber || ''}
            fieldLabel={'Whatsapp'}
            onChange={handlePhoneChange('whatsappNumber')}
            country={phoneCountry}
          />
        </div>
        <div className={styles.right}>
          <EASTextField
            type='text'
            containerClass={styles.simpleField}
            fieldLabel={'Website'}
            value={data.website || ''}
            onChange={handleWebsiteChange}
          />

          <EASSelect
            label={textForKey('default currency')}
            labelId='currency-select-label'
            rootClass={styles.simpleField}
            options={data.allCurrencies}
            value={data.currency}
            onChange={handleCurrencyChange}
          />

          <EASSelect
            label={textForKey('country')}
            labelId='country-select-label'
            rootClass={styles.simpleField}
            options={mappedCountries}
            value={data.country}
            onChange={handleCountryChange}
          />

          <EASSelect
            label={textForKey('time zone')}
            labelId='time-zone-select-label'
            rootClass={styles.simpleField}
            options={mappedTimeZones}
            value={data.timeZone}
            onChange={handleTimeZoneChange}
          />

          <EASTextarea
            type='text'
            maxRows={4}
            rows={4}
            containerClass={styles.descriptionTextArea}
            fieldLabel={textForKey('about clinic')}
            value={data.description}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <LoadingButton
          onClick={handleStartDelete}
          isLoading={isDeleting}
          className={styles.deleteButton}
          disabled={isDeleting || isSaving}
        >
          {textForKey('delete')}
          <IconTrash />
        </LoadingButton>
        <LoadingButton
          onClick={submitForm}
          isLoading={isSaving}
          className={styles.saveButton}
          disabled={isSaving || !isFormValid()}
        >
          {textForKey('save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
