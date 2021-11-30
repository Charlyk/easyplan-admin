import React, { useContext, useEffect, useMemo, useReducer } from 'react';
import sortBy from 'lodash/sortBy';
import upperFirst from 'lodash/upperFirst';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
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
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import {
  clinicTimeZones,
  deleteClinic,
  updateClinic,
} from 'middleware/api/clinic';
import EASSelect from '../../../common/EASSelect';
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
  import('app/components/common/modals/ConfirmationModal'),
);

const CompanyDetailsForm = ({ currentClinic, countries, authToken }) => {
  const router = useRouter();
  const toast = useContext(NotificationsContext);
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
      onRequestError(error);
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
      onRequestError(error);
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
      };
      await updateClinic(requestBody, data.logoFile, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      toast.success(textForKey('Saved successfully'));
      await router.replace(router.asPath);
    } catch (error) {
      onRequestError(error);
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
        title={textForKey('Delete clinic')}
        message={textForKey('delete_clinic_message')}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
      <span className={styles.formTitle}>{textForKey('Company details')}</span>
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
            fieldLabel={textForKey('Clinic name')}
            value={data.clinicName}
            onChange={handleClinicNameChange}
          />

          <EASTextField
            type='email'
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Email')}
            value={data.email}
            onChange={handleEmailChange}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.phoneNumber || ''}
            fieldLabel={textForKey('Phone number')}
            onChange={handlePhoneChange('phoneNumber')}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.telegramNumber || ''}
            fieldLabel={textForKey('Telegram')}
            onChange={handlePhoneChange('telegramNumber')}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.viberNumber || ''}
            fieldLabel={textForKey('Viber')}
            onChange={handlePhoneChange('viberNumber')}
          />

          <EASPhoneInput
            rootClass={styles.simpleField}
            value={data.whatsappNumber || ''}
            fieldLabel={textForKey('Whatsapp')}
            onChange={handlePhoneChange('whatsappNumber')}
          />
        </div>
        <div className={styles.right}>
          <EASTextField
            type='text'
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Website')}
            value={data.website || ''}
            onChange={handleWebsiteChange}
          />

          <EASSelect
            label={textForKey('Default currency')}
            labelId='currency-select-label'
            rootClass={styles.simpleField}
            options={data.allCurrencies}
            value={data.currency}
            onChange={handleCurrencyChange}
          />

          <EASSelect
            label={textForKey('Country')}
            labelId='country-select-label'
            rootClass={styles.simpleField}
            options={mappedCountries}
            value={data.country}
            onChange={handleCountryChange}
          />

          <EASSelect
            label={textForKey('Time zone')}
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
            fieldLabel={textForKey('About clinic')}
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
          {textForKey('Delete')}
          <IconTrash />
        </LoadingButton>
        <LoadingButton
          onClick={submitForm}
          isLoading={isSaving}
          className={styles.saveButton}
          disabled={isSaving || !isFormValid()}
        >
          {textForKey('Save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
