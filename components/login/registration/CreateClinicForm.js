import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import clsx from "clsx";
import styles from "../../../styles/auth/RegisterForm.module.scss";
import { textForKey } from "../../../utils/localization";
import moment from "moment-timezone";
import { generateReducerActions } from "../../../utils/helperFuncs";
import { toast } from "react-toastify";
import { checkDomainAvailability, clinicTimeZones, fetchAvailableCurrencies } from "../../../middleware/api/clinic";
import { Form, Image, InputGroup } from "react-bootstrap";
import IconAvatar from "../../icons/iconAvatar";
import LoadingButton from "../../common/LoadingButton";
import { WebRegex } from "../../../utils/constants";
import debounce from "lodash/debounce";
import { isDev } from "../../../eas.config";

const charactersRegex = /[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/#@]/ig;

const initialState = {
  logoFile: null,
  clinicName: '',
  domainName: '',
  website: '',
  description: '',
  defaultCurrency: 'MDL',
  timeZone: moment.tz.guess(true),
  timeZones: [],
  currencies: [],
  isDomainAvailable: false,
}

const reducerTypes = {
  setLogoFile: 'setLogoFile',
  setClinicName: 'setClinicName',
  setWebsite: 'setWebsite',
  setDescription: 'setDescription',
  setTimeZone: 'setTimeZone',
  setTimeZones: 'setTimeZones',
  setDomainName: 'setDomainName',
  setInitialData: 'setInitialData',
  setDefaultCurrency: 'setDefaultCurrency',
  setIsDomainAvailable: 'setIsDomainAvailable',
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setClinicName:
      return {
        ...state,
        clinicName: action.payload,
        domainName: action.payload
          .toLowerCase()
          .replaceAll(charactersRegex, '')
          .replaceAll(' ', '-')
      };
    case reducerTypes.setLogoFile:
      return { ...state, logoFile: action.payload };
    case reducerTypes.setWebsite:
      return { ...state, website: action.payload };
    case reducerTypes.setDescription:
      return { ...state, description: action.payload };
    case reducerTypes.setTimeZone:
      return { ...state, timeZone: action.payload };
    case reducerTypes.setTimeZones:
      return { ...state, timeZones: action.payload };
    case reducerTypes.setDomainName: {
      const updatedDomain = action.payload
        .toLowerCase()
        .replaceAll(charactersRegex, '')
        .replaceAll(' ', '-');
      return {
        ...state,
        domainName: updatedDomain
      };
    }
    case reducerTypes.setInitialData:
      return { ...state, ...action.payload };
    case reducerTypes.setDefaultCurrency:
      return { ...state, currency: action.payload };
    case reducerTypes.setIsDomainAvailable:
      return { ...state, isDomainAvailable: action.payload };
    default:
      return state;
  }
}

const actions = generateReducerActions(reducerTypes);

const CreateClinicForm = ({ isLoading, redirect, onGoBack, onSubmit }) => {
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
      localDispatch(actions.setInitialData({ timeZones, currencies }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNameChange = (event) => {
    localDispatch(actions.setClinicName(event.target.value));
  }

  const handleDomainChange = (event) => {
    const newDomain = event.target.value.toLowerCase()
    localDispatch(actions.setDomainName(newDomain));
  }

  const handleWebsiteChange = (event) => {
    localDispatch(actions.setWebsite(event.target.value));
  }

  const handleTimeZoneChange = (event) => {
    localDispatch(actions.setTimeZone(event.target.value));
  }

  const handleDescriptionChange = (event) => {
    localDispatch(actions.setDescription(event.target.value));
  }

  const handleCurrencyChange = (event) => {
    localDispatch(actions.setDefaultCurrency(event.target.value));
  }

  const handleLogoChange = (event) => {
    const files = event.target.files;
    if (files != null) {
      localDispatch(actions.setLogoFile(files[0]));
    }
  };

  const checkIsDomainAvailable = async () => {
    try {
      let domainToCheck = domainName;
      if (isDev) {
        domainToCheck = `${domainToCheck}-dev`
      }
      const { data: isAvailable } = await checkDomainAvailability(domainToCheck);
      localDispatch(actions.setIsDomainAvailable(isAvailable));
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
    onSubmit({
      logoFile,
      clinicName,
      website,
      timeZone,
      description,
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
          {textForKey('Create new account')}
        </LoadingButton>
      </div>
    </div>
  )
}

export default CreateClinicForm;
