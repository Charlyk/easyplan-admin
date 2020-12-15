import React, { useEffect, useState } from 'react';

import { Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';

import IconLogoPlaceholder from '../../assets/icons/iconLogoPlaceholder';
import IconSuccess from '../../assets/icons/iconSuccess';
import IconTrash from '../../assets/icons/iconTrash';
import ConfirmationModal from '../../components/ConfirmationModal';
import LoadingButton from '../../components/LoadingButton';
import {
  changeSelectedClinic,
  setCreateClinic,
} from '../../redux/actions/actions';
import { setClinic } from '../../redux/actions/clinicActions';
import { clinicDetailsSelector } from '../../redux/selectors/clinicSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { EmailRegex } from '../../utils/constants';
import { uploadFileToAWS, urlToLambda } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';

const CompanyDetailsForm = props => {
  const dispatch = useDispatch();
  const currentClinic = useSelector(clinicDetailsSelector);
  const currentUser = useSelector(userSelector);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false });
  const [data, setData] = useState({
    id: '',
    logoUrl: null,
    logoFile: null,
    clinicName: '',
    email: '',
    website: '',
    phoneNumber: '',
    description: '',
    socialNetworks: '',
    workdays: [],
    currency: 'MDL',
    country: 'md',
    isPhoneValid: true,
    hasBrackets: false,
  });

  useEffect(() => {
    setData({
      ...data,
      ...currentClinic,
    });
  }, [props, currentClinic]);

  const handleLogoChange = event => {
    if (isSaving) return;
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, logoFile: files[0] });
    }
  };

  const handleFormChange = event => {
    if (isSaving) return;
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handlePhoneChange = (value, _, event) => {
    if (isSaving) return;
    setData({
      ...data,
      phoneNumber: `+${value}`,
      isPhoneValid: !event.target?.classList.value.includes('invalid-number'),
    });
  };

  const handleStartDelete = () => {
    console.log(currentUser);
    setDeleteModal({ open: true });
  };

  const handleCloseDelete = () => {
    setDeleteModal({ open: false });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const response = await dataAPI.deleteClinic();
    if (!response.isError) {
      if (currentUser.clinicIds.length > 0) {
        dispatch(changeSelectedClinic(currentUser.clinicIds[0]));
      } else {
        dispatch(setCreateClinic({ open: true, canClose: false }));
      }
    }
    setIsDeleting(false);
  };

  const isFormValid = () => {
    return (
      data.clinicName?.length > 3 &&
      (data.phoneNumber == null ||
        data.phoneNumber.length === 0 ||
        data.isPhoneValid) &&
      (data.email == null ||
        data.email.length === 0 ||
        data.email.match(EmailRegex))
    );
  };

  const submitForm = async () => {
    if (!isFormValid()) return;
    setIsSaving(true);
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
      website: data.website,
      currency: data.currency,
      country: data.country,
      description: data.description,
      workdays: data.workdays,
      hasBrackets: data.hasBrackets,
      logoUrl,
    };

    const response = await dataAPI.updateClinic(requestBody);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(setClinic(response.data));
      setData({ ...data, ...response.data });
    }
    setIsSaving(false);
  };

  const logoSrc =
    (data.logoFile && window.URL.createObjectURL(data.logoFile)) ||
    (data.logoUrl ? urlToLambda(data.logoUrl, 64) : null);

  return (
    <div className='company-details-form'>
      <ConfirmationModal
        isLoading={isDeleting}
        title={textForKey('Delete clinic')}
        message={textForKey('delete_clinic_message')}
        show={deleteModal.open}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
      <span className='form-title'>{textForKey('Company details')}</span>
      <div className='data-wrapper'>
        <div className='left'>
          <div className='upload-avatar-container'>
            {logoSrc ? (
              <Image roundedCircle src={logoSrc} />
            ) : (
              <IconLogoPlaceholder />
            )}
            <span style={{ margin: '1rem' }} className='info-text'>
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
            <InputGroup>
              <Form.Control
                type='text'
                onChange={handleFormChange}
                value={data.clinicName || ''}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>{textForKey('Email')}</Form.Label>
            <InputGroup>
              <Form.Control
                isValid={data.email?.match(EmailRegex)}
                type='text'
                onChange={handleFormChange}
                value={data.email || ''}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId='phoneNumber'>
            <Form.Label>{textForKey('Phone number')}</Form.Label>
            <InputGroup>
              <PhoneInput
                onChange={handlePhoneChange}
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
            </InputGroup>
          </Form.Group>
          <Form.Group controlId='website'>
            <Form.Label>{textForKey('Website')}</Form.Label>
            <InputGroup>
              <Form.Control
                type='text'
                onChange={handleFormChange}
                value={data.website || ''}
              />
            </InputGroup>
          </Form.Group>
        </div>
        <div className='right'>
          <Form.Group style={{ flexDirection: 'column' }} controlId='currency'>
            <Form.Label>{textForKey('Currency')}</Form.Label>
            <Form.Control
              as='select'
              className='mr-sm-2'
              custom
              onChange={handleFormChange}
              value={data.currency}
            >
              <option value='MDL'>{textForKey('Moldavian Leu')}</option>
              <option value='RON'>{textForKey('Romanian Leu')}</option>
              <option value='EUR'>{textForKey('Euro')}</option>
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
          <Form.Group controlId='description'>
            <Form.Label>{textForKey('About clinic')}</Form.Label>
            <InputGroup>
              <Form.Control
                className='description-text-area'
                as='textarea'
                value={data.description}
                aria-label='With textarea'
                onChange={handleFormChange}
              />
            </InputGroup>
          </Form.Group>
        </div>
      </div>
      <div className='footer'>
        <LoadingButton
          onClick={handleStartDelete}
          className='delete-button'
          isLoading={isSaving}
          disabled={isSaving || !isFormValid()}
        >
          {textForKey('Delete')}
          <IconTrash />
        </LoadingButton>
        <LoadingButton
          onClick={submitForm}
          className='positive-button'
          isLoading={isSaving}
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
