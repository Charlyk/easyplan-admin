import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import moment from 'moment-timezone';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { Form, Image, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import IconAvatar from '../../icons/iconAvatar';
import { generateReducerActions, uploadFileToAWS } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../../common/EasyPlanModal';

import {
  checkDomainAvailability,
  clinicTimeZones,
  createNewClinic,
  fetchAvailableCurrencies
} from "../../../middleware/api/clinic";
import styles from '../../../styles/CreateClinicModal.module.scss';
import { WebRegex } from "../../../utils/constants";

const charactersRegex = /[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/#@]/ig;

const initialState = {
  isLoading: false,
  timeZones: [],
  currencies: [],
  isDomainAvailable: false,
  logoFile: null,
  clinicName: '',
  website: '',
  description: '',
  timeZone: moment.tz.guess(true),
  defaultCurrency: 'MDL',
  domainName: '',
}

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setTimeZones: 'setTimeZones',
  setCurrencies: 'setCurrencies',
  setIsDomainAvailable: 'setIsDomainAvailable',
  setLogoFile: 'setLogoFile',
  setClinicName: 'setClinicName',
  setWebsite: 'setWebsite',
  setDescription: 'setDescription',
  setTimeZone: 'setTimeZone',
  setDefaultCurrency: 'setDefaultCurrency',
  setDomainName: 'setDomainName',
}

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setTimeZones:
      return { ...state, timeZones: action.payload };
    case reducerTypes.setCurrencies:
      return { ...state, currencies: action.payload };
    case reducerTypes.setIsDomainAvailable:
      return { ...state, isDomainAvailable: action.payload };
    case reducerTypes.setLogoFile:
      return { ...state, logoFile: action.payload };
    case reducerTypes.setClinicName:
      return {
        ...state,
        clinicName: action.payload,
        domainName: action.payload
          .toLowerCase()
          .replaceAll(charactersRegex, '')
          .replaceAll(' ', '-'),
      };
    case reducerTypes.setWebsite:
      return { ...state, website: action.payload };
    case reducerTypes.setDescription:
      return { ...state, description: action.payload };
    case reducerTypes.setTimeZone:
      return { ...state, timeZone: action.payload };
    case reducerTypes.setDefaultCurrency:
      return { ...state, defaultCurrency: action.payload };
    case reducerTypes.setDomainName:
      return {
        ...state,
        domainName: action.payload
          .toLowerCase()
          .replaceAll(charactersRegex, '')
          .replaceAll(' ', '-')
      };
  }
}

const actions = generateReducerActions(reducerTypes);

const CreateClinicModal = ({ open, onCreate, onClose }) => {
  const [{
    isLoading,
    timeZones,
    currencies,
    isDomainAvailable,
    logoFile,
    clinicName,
    website,
    description,
    timeZone,
    defaultCurrency,
    domainName,
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchTimeZones();
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (domainName.length > 0) {
      handleDomainNameUpdated();
    }
  }, [domainName]);

  const fetchTimeZones = async () => {
    localDispatch(actions.setIsLoading(true))
    try {
      const response = await clinicTimeZones();
      localDispatch(actions.setTimeZones(response.data))
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false))
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await fetchAvailableCurrencies();
      localDispatch(actions.setCurrencies(response.data));
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleClinicNameChange = (event) => {
    localDispatch(actions.setClinicName(event.target.value));
  };

  const handleClinicDomainChange = (event) => {
    localDispatch(actions.setDomainName(event.target.value));
  }

  const handleWebsiteChange = (event) => {
    localDispatch(actions.setWebsite(event.target.value));
  }

  const handleCurrencyChange = (event) => {
    localDispatch(actions.setDefaultCurrency(event.target.value));
  }

  const handleTimeZoneChange = (event) => {
    localDispatch(actions.setTimeZone(event.target.value));
  }

  const handleDescriptionChange = (event) => {
    localDispatch(actions.setDescription(event.target.value));
  }

  const checkIsDomainAvailable = async () => {
    try {
      const { data: isAvailable } = await checkDomainAvailability(domainName);
      localDispatch(actions.setIsDomainAvailable(isAvailable));
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleDomainNameUpdated = useCallback(debounce(checkIsDomainAvailable, 400), [domainName]);

  const handleLogoChange = (event) => {
    const files = event.target.files;
    if (files != null) {
      localDispatch(actions.setLogoFile(files[0]));
    }
  };

  const submitForm = async () => {
    if (!isFormValid || isLoading) {
      return;
    }

    localDispatch(actions.setIsLoading(true))
    try {
      let logo = null;
      if (logoFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', logoFile);
        logo = uploadResult?.location;
      }
      const requestBody = {
        clinicName,
        website,
        description,
        defaultCurrency,
        domainName,
        logo,
      };
      const response = await createNewClinic(requestBody);
      onCreate(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false))
    }
  };

  const isFormValid = useMemo(() => {
    return (
      clinicName.length > 3 &&
      domainName.length > 3 &&
      isDomainAvailable &&
      (website.length === 0 || website.match(WebRegex))
    )
  }, [website, domainName, clinicName, isDomainAvailable]);

  const logoSrc = logoFile && window.URL.createObjectURL(logoFile);

  return (
    <EasyPlanModal
      className={styles['create-clinic-modal-root']}
      open={open}
      onClose={onClose}
      onPositiveClick={submitForm}
      isPositiveDisabled={!isFormValid || isLoading}
      isPositiveLoading={isLoading}
      title={textForKey('Create clinic')}
    >
      <div className='upload-avatar-container'>
        {logoSrc ? <Image roundedCircle src={logoSrc}/> : <IconAvatar/>}
        <span style={{ margin: '1rem' }}>
          {textForKey('JPG or PNG, Max size of 800kb')}
        </span>
        <Form.Group>
          <input
            className='custom-file-button'
            type='file'
            name='logo-file'
            id='logo-file'
            accept='.jpg,.jpeg,.png'
            onChange={handleLogoChange}
          />
          <label htmlFor='logo-file'>{textForKey('Upload image')}</label>
        </Form.Group>
      </div>
      <Form.Group controlId='clinicName'>
        <Form.Label>{textForKey('Clinic name')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={clinicName}
            type='text'
            onChange={handleClinicNameChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='domainName'>
        <Form.Label>{textForKey('Domain name')}</Form.Label>
        <InputGroup>
          <Form.Control
            isInvalid={domainName.length > 0 && !isDomainAvailable}
            isValid={domainName.length > 0 && isDomainAvailable}
            value={domainName}
            type='text'
            onChange={handleClinicDomainChange}
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>.easyplan.pro</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='website'>
        <Form.Label>{`${textForKey('Website')} (${textForKey(
          'optional',
        ).toLowerCase()})`}</Form.Label>
        <InputGroup>
          <Form.Control
            value={website}
            type='text'
            onChange={handleWebsiteChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='defaultCurrency'>
        <Form.Label>{textForKey('Currency')}</Form.Label>
        <Form.Control
          as='select'
          onChange={handleCurrencyChange}
          value={defaultCurrency}
          custom
        >
          {currencies.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId='timeZone'>
        <Form.Label>{textForKey('Time zone')}</Form.Label>
        <Form.Control
          as='select'
          onChange={handleTimeZoneChange}
          value={timeZone}
          custom
        >
          {timeZones.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId='description'>
        <Form.Label>{`${textForKey('About clinic')} (${textForKey(
          'optional',
        ).toLowerCase()})`}</Form.Label>
        <InputGroup>
          <Form.Control
            as='textarea'
            value={description}
            onChange={handleDescriptionChange}
            aria-label='With textarea'
          />
        </InputGroup>
      </Form.Group>
    </EasyPlanModal>
  );
};

export default CreateClinicModal;

CreateClinicModal.propTypes = {
  open: PropTypes.bool,
  onCreate: PropTypes.func,
  onClose: PropTypes.func,
};

CreateClinicModal.defaultProps = {
  onClose: null,
};
