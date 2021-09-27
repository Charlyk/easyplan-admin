import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { Form, Image, InputGroup } from "react-bootstrap";
import clsx from "clsx";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";

import { isDev } from "../../../../eas.config";
import { textForKey } from "../../../../utils/localization";
import { WebRegex } from "../../../utils/constants";
import { checkDomainAvailability, clinicTimeZones, fetchAvailableCurrencies } from "../../../../middleware/api/clinic";
import IconAvatar from "../../icons/iconAvatar";
import LoadingButton from "../../../../components/common/LoadingButton";

import reducer, {
  initialState,
  setLogoFile,
  setClinicName,
  setWebsite,
  setDescription,
  setTimeZone,
  setDomainName,
  setInitialData,
  setDefaultCurrency,
  setIsDomainAvailable,
  setCountryIso,
} from './createClinicSlice'
import styles from "./CreateClinicForm.module.scss";

const CreateClinicForm = ({ isLoading, redirect, countries, onGoBack, onSubmit }) => {
  const [{
    logoFile,
    clinicName,
    website,
    description,
    timeZone,
    timeZones,
    domainName,
    currencies,
    defaultCurrency,
    isDomainAvailable,
    countryIso
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchTimeZones();
  }, []);

  useEffect(() => {
    if (domainName.length > 0) {
      handleDomainNameUpdated();
    }
  }, [domainName]);

  const fetchTimeZones = async () => {
    try {
      const { data: timeZones } = await clinicTimeZones();
      const { data: currencies } = await fetchAvailableCurrencies();
      localDispatch(setInitialData({ timeZones, currencies }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNameChange = (event) => {
    localDispatch(setClinicName(event.target.value));
  }

  const handleDomainChange = (event) => {
    const newDomain = event.target.value.toLowerCase()
    localDispatch(setDomainName(newDomain));
  }

  const handleWebsiteChange = (event) => {
    localDispatch(setWebsite(event.target.value));
  }

  const handleTimeZoneChange = (event) => {
    localDispatch(setTimeZone(event.target.value));
  }

  const handleDescriptionChange = (event) => {
    localDispatch(setDescription(event.target.value));
  }

  const handleCurrencyChange = (event) => {
    localDispatch(setDefaultCurrency(event.target.value));
  }

  const handleCountryChange = (event) => {
    localDispatch(setCountryIso(event.target.value));
  }

  const handleLogoChange = (event) => {
    const files = event.target.files;
    if (files != null) {
      localDispatch(setLogoFile(files[0]));
    }
  };

  const checkIsDomainAvailable = async () => {
    try {
      let domainToCheck = domainName;
      if (isDev) {
        domainToCheck = `${domainToCheck}-dev`
      }
      const { data: isAvailable } = await checkDomainAvailability(domainToCheck);
      localDispatch(setIsDomainAvailable(isAvailable));
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleDomainNameUpdated = useCallback(debounce(checkIsDomainAvailable, 400), [domainName]);

  const isFormValid = useMemo(() => {
    return (
      clinicName.length > 3 &&
      domainName.length > 3 &&
      isDomainAvailable &&
      (website.length === 0 || website.match(WebRegex))
    )
  }, [website, clinicName, domainName, isDomainAvailable]);

  const handleSubmitForm = () => {
    if (!isFormValid) {
      return;
    }
    onSubmit({
      logoFile,
      clinicName,
      website,
      timeZone,
      description,
      countryIso,
      domainName: isDev ? `${domainName}-dev` : domainName,
      defaultCurrency,
    });
  }

  const handleGoBack = () => {
    onGoBack();
  }

  const logoSrc = logoFile && window.URL.createObjectURL(logoFile);

  return (
    <div className={clsx('form-root', styles['register-form'])}>
      <span className='form-title'>{textForKey('Create clinic')}</span>
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
            onChange={handleNameChange}
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
            onChange={handleDomainChange}
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>{isDev ? '-dev' : ''}.easyplan.pro</InputGroup.Text>
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
      <Form.Group style={{ flexDirection: 'column' }} controlId='country'>
        <Form.Label>{textForKey('Country')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          custom
          onChange={handleCountryChange}
          value={countryIso}
        >
          {countries?.map(country => (
            <option key={country.iso} value={country.iso}>
              {textForKey(country.name)}
            </option>
          ))}
        </Form.Control>
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
      <div className='footer'>
        <div
          role='button'
          tabIndex={0}
          className='back-button'
          onClick={handleGoBack}
        >
          {redirect
            ? `${textForKey('Already have an account')}?`
            : textForKey('go back')
          }
        </div>
        <LoadingButton
          onClick={handleSubmitForm}
          isLoading={isLoading}
          className='positive-button'
          disabled={!isFormValid}
        >
          {redirect
            ? textForKey('Create new account')
            : textForKey('Create clinic')
          }
        </LoadingButton>
      </div>
    </div>
  )
}

export default CreateClinicForm;
