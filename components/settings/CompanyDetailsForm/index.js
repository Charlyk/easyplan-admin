import React, { useEffect, useState } from 'react';

import upperFirst from 'lodash/upperFirst';
import moment from 'moment-timezone';
import { Form } from 'react-bootstrap';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import IconLogoPlaceholder from '../../icons/iconLogoPlaceholder';
import IconSuccess from '../../icons/iconSuccess';
import IconTrash from '../../icons/iconTrash';
import ConfirmationModal from '../../common/ConfirmationModal';
import LoadingButton from '../../common/LoadingButton';
import {
  changeSelectedClinic,
  setCreateClinic,
} from '../../../redux/actions/actions';
import { setClinic } from '../../../redux/actions/clinicActions';
import { EmailRegex } from '../../../utils/constants';
import {
  uploadFileToAWS,
  urlToLambda,
} from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/CompanyDetailsForm.module.scss'
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";
import { useRouter } from "next/router";

const CompanyDetailsForm = ({ currentUser, currentClinic }) => {
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

  useEffect(() => {
    fetchTimeZones();
  }, []);

  useEffect(() => {
    setData({
      ...data,
      ...currentClinic,
    });
  }, [currentClinic]);

  const fetchTimeZones = async () => {
    setIsSaving(true);
    try {
      const response = await axios.get(`${baseAppUrl}/api/clinic/timezones`);
      setTimeZones(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = (event) => {
    if (isSaving) return;
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, logoFile: files[0] });
    }
  };

  const handleFormChange = (event) => {
    if (isSaving) return;
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handlePhoneChange = (phoneType) => (value, _, event) => {
    const validationFieldName = `isValid${upperFirst(phoneType)}`;
    if (isSaving) return;
    setData({
      ...data,
      [phoneType]: `+${value}`,
      [validationFieldName]: !event.target?.classList.value.includes(
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
      await axios.delete(`${baseAppUrl}/api/clinic`);
      if (currentUser.clinicIds.length > 0) {
        dispatch(changeSelectedClinic(currentUser.clinicIds[0]));
      } else {
        dispatch(setCreateClinic({ open: true, canClose: false }));
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
      let logoUrl = data.logoUrl;
      if (data.logoFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', data.logoFile);
        logoUrl = uploadResult?.location;
      }
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
        logoUrl,
      };

      const response = await axios.put(`${baseAppUrl}/api/clinic`, requestBody);
      router.replace(router.asPath);
      setData({ ...data, ...response.data });
      toast.success(textForKey('Saved successfully'));

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const logoSrc =
    (data.logoFile && window.URL.createObjectURL(data.logoFile)) ||
    (data.logoUrl ? urlToLambda(data.logoUrl, 150) : null);

  return (
    <div className={styles['company-details-form']}>
      <ConfirmationModal
        isLoading={isDeleting}
        title={textForKey('Delete clinic')}
        message={textForKey('delete_clinic_message')}
        show={deleteModal.open}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
      <span className={styles['form-title']}>{textForKey('Company details')}</span>
      <div className={styles['data-wrapper']}>
        <div className={styles.left}>
          <div className='upload-avatar-container'>
            {logoSrc ? <img alt={data.clinicName} src={logoSrc}/> : <IconLogoPlaceholder/>}
            <span style={{ margin: '1rem' }} className={styles['info-text']}>
              {textForKey('JPG or PNG, Max size of 800kb')}
            </span>
            <Form.Group>
              <input
                className='custom-file-button'
                type='file'
                name='avatar-file'
                id='avatar-file'
                accept='.jpg,.jpeg,.png'
                onChange={handleLogoChange}
              />
              <label htmlFor='avatar-file'>{textForKey('Upload image')}</label>
            </Form.Group>
          </div>
          <Form.Group controlId='clinicName'>
            <Form.Label>{textForKey('Clinic name')}</Form.Label>
            <Form.Control
              type='text'
              onChange={handleFormChange}
              value={data.clinicName || ''}
            />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>{textForKey('Email')}</Form.Label>
            <Form.Control
              isValid={data.email?.match(EmailRegex)}
              type='text'
              onChange={handleFormChange}
              value={data.email || ''}
            />
          </Form.Group>
          <Form.Group controlId='phoneNumber'>
            <Form.Label>{textForKey('Phone number')}</Form.Label>
            <PhoneInput
              onChange={handlePhoneChange('phoneNumber')}
              value={data.phoneNumber || ''}
              alwaysDefaultMask
              countryCodeEditable={false}
              country='md'
              isValid={(inputNumber, country) => {
                const phoneNumber = inputNumber.replace(
                  `${country.dialCode}`,
                  '',
                );
                return phoneNumber.length === 0 || phoneNumber.length === 8;
              }}
            />
          </Form.Group>
          <Form.Group controlId='telegramNumber'>
            <Form.Label>
              <Image
                className={styles['messenger-icon']}
                width={25}
                height={25}
                src='/telegram_icon.png'
                alt='Telegram'
              />
              Telegram
            </Form.Label>
            <PhoneInput
              onChange={handlePhoneChange('telegramNumber')}
              value={data.telegramNumber || ''}
              alwaysDefaultMask
              countryCodeEditable={false}
              country='md'
              isValid={(inputNumber, country) => {
                const phoneNumber = inputNumber.replace(
                  `${country.dialCode}`,
                  '',
                );
                return phoneNumber.length === 0 || phoneNumber.length === 8;
              }}
            />
          </Form.Group>
          <Form.Group controlId='viberNumber'>
            <Form.Label>
              <Image className={styles['messenger-icon']}
                     width={25}
                     height={25} src='/viber_icon.png' alt='Viber'/>
              Viber
            </Form.Label>
            <PhoneInput
              onChange={handlePhoneChange('viberNumber')}
              value={data.viberNumber || ''}
              alwaysDefaultMask
              countryCodeEditable={false}
              country='md'
              isValid={(inputNumber, country) => {
                const phoneNumber = inputNumber.replace(
                  `${country.dialCode}`,
                  '',
                );
                return phoneNumber.length === 0 || phoneNumber.length === 8;
              }}
            />
          </Form.Group>
          <Form.Group controlId='whatsappNumber'>
            <Form.Label>
              <Image
                className={styles['messenger-icon']}
                width={25}
                height={25}
                src='/whatsapp_icon.png'
                alt='Whatsapp'
              />
              WhatsApp
            </Form.Label>
            <PhoneInput
              onChange={handlePhoneChange('whatsappNumber')}
              value={data.whatsappNumber || ''}
              alwaysDefaultMask
              countryCodeEditable={false}
              country='md'
              isValid={(inputNumber, country) => {
                const phoneNumber = inputNumber.replace(
                  `${country.dialCode}`,
                  '',
                );
                return phoneNumber.length === 0 || phoneNumber.length === 8;
              }}
            />
          </Form.Group>
        </div>
        <div className={styles.right}>
          <Form.Group controlId='website'>
            <Form.Label>{textForKey('Website')}</Form.Label>
            <Form.Control
              type='text'
              onChange={handleFormChange}
              value={data.website || ''}
            />
          </Form.Group>
          <Form.Group style={{ flexDirection: 'column' }} controlId='currency'>
            <Form.Label>{textForKey('Default currency')}</Form.Label>
            <Form.Control
              as='select'
              className='mr-sm-2'
              custom
              onChange={handleFormChange}
              value={data.currency}
            >
              {data.allCurrencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.id} - {currency.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group style={{ flexDirection: 'column' }} controlId='country'>
            <Form.Label>{textForKey('Country')}</Form.Label>
            <Form.Control
              as='select'
              className='mr-sm-2'
              custom
              onChange={handleFormChange}
              value={data.country}
            >
              <option value='md'>{textForKey('Republic of Moldova')}</option>
              <option value='ro'>{textForKey('Romania')}</option>
            </Form.Control>
          </Form.Group>
          <Form.Group style={{ flexDirection: 'column' }} controlId='timeZone'>
            <Form.Label>{textForKey('Time zone')}</Form.Label>
            <Form.Control
              as='select'
              className='mr-sm-2'
              custom
              onChange={handleFormChange}
              value={data.timeZone}
            >
              {timeZones.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='description'>
            <Form.Label>{textForKey('About clinic')}</Form.Label>
              <Form.Control
                className={styles['description-text-area']}
                as='textarea'
                value={data.description}
                aria-label='With textarea'
                onChange={handleFormChange}
              />
          </Form.Group>
        </div>
      </div>
      <div className={styles['footer']}>
        <LoadingButton
          onClick={handleStartDelete}
          className='delete-button'
          isLoading={isSaving}
          disabled={isSaving || !isFormValid()}
        >
          {textForKey('Delete')}
          <IconTrash/>
        </LoadingButton>
        <LoadingButton
          onClick={submitForm}
          className='positive-button'
          isLoading={isSaving}
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
