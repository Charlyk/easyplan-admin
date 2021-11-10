import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import upperFirst from 'lodash/upperFirst';
import sortBy from 'lodash/sortBy';
import moment from 'moment-timezone';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import IconLogoPlaceholder from '../../../icons/iconLogoPlaceholder';
import IconSuccess from '../../../icons/iconSuccess';
import IconTrash from '../../../icons/iconTrash';
import LoadingButton from '../../../common/LoadingButton';
import { changeSelectedClinic } from '../../../../../redux/actions/actions';
import { EmailRegex, HeaderKeys } from '../../../../utils/constants';
import { textForKey } from '../../../../utils/localization';
import {
  clinicTimeZones,
  deleteClinic,
  updateClinic
} from "../../../../../middleware/api/clinic";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";
import EASTextField from "../../../common/EASTextField";
import EASPhoneInput from "../../../common/EASPhoneInput";
import EASSelect from "../../../common/EASSelect";
import EASTextarea from "../../../common/EASTextarea";
import UploadAvatar from "../../../common/UploadAvatar";
import styles from './CompanyDetailsForm.module.scss';

const ConfirmationModal = dynamic(() => import('../../../common/modals/ConfirmationModal'));

const CompanyDetailsForm = ({ currentUser, currentClinic, countries, authToken }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false });
  const [timeZones, setTimeZones] = useState([]);
  const [data, setData] = useState({
    id: '',
    logoUrl: null,
    logoFile: null,
    clinicName: '',
    email: '',
    website: '',
    phoneNumber: '',
    telegramNumber: '',
    viberNumber: '',
    whatsappNumber: '',
    description: '',
    socialNetworks: '',
    workdays: [],
    currency: 'MDL',
    allCurrencies: [],
    country: 'md',
    timeZone: moment.tz.guess(true),
    isValidPhoneNumber: true,
    isValidViberNumber: true,
    isValidTelegramNumber: true,
    isValidWhatsappNumber: true,
    hasBrackets: false,
  });

  const mappedCountries = useMemo(() => {
    return countries.map(item => ({
      ...item,
      id: item.iso,
    }));
  }, [countries]);

  const mappedTimeZones = useMemo(() => {
    return sortBy(timeZones.map(item => ({
      id: item,
      name: item,
    })), item => item.name);
  }, [timeZones]);

  useEffect(() => {
    fetchTimeZones();
  }, []);

  useEffect(() => {
    setData({
      ...data,
      ...currentClinic,
      allCurrencies: currentClinic.allCurrencies.map(item => ({
        ...item,
        name: `${item.id} - ${item.name}`,
      }))
    });
  }, [currentClinic]);

  const fetchTimeZones = async () => {
    setIsSaving(true);
    try {
      const response = await clinicTimeZones();
      setTimeZones(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = (file) => {
    if (isSaving) return;
    if (file != null) {
      setData({ ...data, logoFile: file });
    }
  };

  const handleFormChange = (fieldId, value) => {
    if (isSaving) return;
    setData({
      ...data,
      [fieldId]: value,
    });
  };

  const handleTimeZoneChange = (event) => {
    handleFormChange('timeZone', event.target.value);
  };

  const handleDescriptionChange = (newValue) => {
    handleFormChange('description', newValue);
  };

  const handleCurrencyChange = (event) => {
    handleFormChange('currency', event.target.value);
  }

  const handleClinicNameChange = (newValue) => {
    handleFormChange('clinicName', newValue);
  };

  const handleEmailChange = (newValue) => {
    handleFormChange('email', newValue);
  };

  const handleWebsiteChange = (newValue) => {
    handleFormChange('website', newValue);
  }

  const handleCountryChange = (event) => {
    handleFormChange('country', event.target.value);
  }

  const handlePhoneChange = (phoneType) => (value, country, event) => {
    const validationFieldName = `isValid${upperFirst(phoneType)}`;
    if (isSaving) return;
    setData({
      ...data,
      [phoneType]: `+${value}`,
      [validationFieldName]: isPhoneNumberValid(value, country) && !event.target?.classList.value.includes(
        'invalid-number',
      ),
    });
  };

  const handleStartDelete = () => {
    setDeleteModal({ open: true });
  };

  const handleCloseDelete = () => {
    setDeleteModal({ open: false });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClinic();
      if (currentUser.clinicIds.length > 0) {
        dispatch(changeSelectedClinic(currentUser.clinicIds[0]));
      } else {
        await router.push('/create-clinic?redirect=1');
      }
    } catch (error) {
      toast.error(error.response);
    } finally {
      setIsDeleting(false);
    }
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
    setIsSaving(true);
    try {
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

      const response = await updateClinic(requestBody, data.logoFile, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      await router.replace(router.asPath);
      setData({ ...data, ...response.data });
      toast.success(textForKey('Saved successfully'));

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const phoneNumberLabel = (icon, text) => {
    return (
      <span style={{ display: "flex", alignItems: 'center' }}>
        <Image
          width={25}
          height={25}
          src={`/${icon}_icon.png`}
          alt={text}
        />
        {text}
      </span>
    )
  }

  const logoSrc =
    (data.logoFile && window.URL.createObjectURL(data.logoFile)) ||
    (data.logoUrl ? data.logoUrl : null);

  return (
    <div className={styles.companyDetailsForm}>
      <ConfirmationModal
        isLoading={isDeleting}
        title={textForKey('Delete clinic')}
        message={textForKey('delete_clinic_message')}
        show={deleteModal.open}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
      <span className={styles.formTitle}>
        {textForKey('Company details')}
      </span>
      <UploadAvatar
        currentAvatar={data.logoFile || logoSrc}
        placeholder={<IconLogoPlaceholder/>}
        onChange={handleLogoChange}
      />

      <div className={styles.dataWrapper}>
        <div className={styles.left}>
          <EASTextField
            type="text"
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Clinic name')}
            value={data.clinicName}
            onChange={handleClinicNameChange}
          />

          <EASTextField
            type="email"
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
            type="text"
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Website')}
            value={data.website || ''}
            onChange={handleWebsiteChange}
          />

          <EASSelect
            label={textForKey('Default currency')}
            labelId="currency-select-label"
            rootClass={styles.simpleField}
            options={data.allCurrencies}
            value={data.currency}
            onChange={handleCurrencyChange}
          />

          <EASSelect
            label={textForKey('Country')}
            labelId="country-select-label"
            rootClass={styles.simpleField}
            options={mappedCountries}
            value={data.country}
            onChange={handleCountryChange}
          />

          <EASSelect
            label={textForKey('Time zone')}
            labelId="time-zone-select-label"
            rootClass={styles.simpleField}
            options={mappedTimeZones}
            value={data.timeZone}
            onChange={handleTimeZoneChange}
          />

          <EASTextarea
            type="text"
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
          <IconTrash/>
        </LoadingButton>
        <LoadingButton
          onClick={submitForm}
          isLoading={isSaving}
          className={styles.saveButton}
          disabled={isSaving || !isFormValid()}
        >
          {textForKey('Save')}
          <IconSuccess/>
        </LoadingButton>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
