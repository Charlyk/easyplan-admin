import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import { useTranslate } from 'react-polyglot';
import NotificationsContext from 'app/context/notificationsContext';
import { WebRegex } from 'app/utils/constants';
import {
  checkDomainAvailability,
  clinicTimeZones,
  fetchAvailableCurrencies,
} from 'middleware/api/clinic';
import EASSelect from '../EASSelect';
import EASTextarea from '../EASTextarea';
import EASTextField from '../EASTextField';
import LoadingButton from '../LoadingButton';
import UploadAvatar from '../UploadAvatar';
import styles from './CreateClinicForm.module.scss';
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
  setCountry,
} from './createClinicSlice';

const CreateClinicForm = ({
  isLoading,
  isMobile,
  redirect,
  countries,
  onGoBack,
  onSubmit,
}) => {
  const textForKey = useTranslate();
  const toast = useContext(NotificationsContext);
  const [
    {
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
      country,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const mappedCountries = useMemo(() => {
    return countries.map((item) => ({
      ...item,
      label: item.name,
    }));
  }, [countries]);

  const mappedCurrencies = useMemo(() => {
    return currencies.map((item) => ({
      ...item,
      name: `${item.id} - ${item.name}`,
    }));
  }, [currencies]);

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

  const handleNameChange = (newValue) => {
    localDispatch(setClinicName(newValue));
  };

  const handleDomainChange = (newDomain) => {
    localDispatch(setDomainName(newDomain.toLowerCase()));
  };

  const handleWebsiteChange = (newValue) => {
    localDispatch(setWebsite(newValue));
  };

  const handleTimeZoneChange = (event) => {
    localDispatch(setTimeZone(event.target.value));
  };

  const handleDescriptionChange = (newValue) => {
    localDispatch(setDescription(newValue));
  };

  const handleCurrencyChange = (event) => {
    localDispatch(setDefaultCurrency(event.target.value));
  };

  const handleCountryChange = (event) => {
    const country = countries.find((item) => item.id === event.target.value);
    localDispatch(setCountry(country));
  };

  const handleLogoChange = (file) => {
    if (file != null) {
      localDispatch(setLogoFile(file));
    }
  };

  const checkIsDomainAvailable = async () => {
    try {
      const { data } = await checkDomainAvailability(domainName);
      localDispatch(setIsDomainAvailable(!data.exists));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDomainNameUpdated = useCallback(
    debounce(checkIsDomainAvailable, 400),
    [domainName],
  );

  const isFormValid = useMemo(() => {
    return (
      defaultCurrency &&
      timeZone &&
      country != null &&
      clinicName.length > 3 &&
      domainName.length > 3 &&
      isDomainAvailable &&
      (website.length === 0 || website.match(WebRegex))
    );
  }, [
    website,
    clinicName,
    domainName,
    country,
    defaultCurrency,
    timeZone,
    isDomainAvailable,
  ]);

  const handleSubmitForm = (event) => {
    event?.preventDefault();
    if (!isFormValid) {
      return;
    }
    onSubmit({
      logoFile,
      clinicName,
      website,
      timeZone,
      description,
      countryIso: country.iso,
      domainName: domainName,
      defaultCurrency,
    });
  };

  const handleGoBack = () => {
    onGoBack();
  };

  return (
    <div
      className={styles.registerForm}
      style={{
        padding: isMobile ? '1rem' : '2rem',
        width: isMobile ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
      }}
    >
      <span className={styles.formTitle}>{textForKey('create clinic')}</span>
      <form onSubmit={handleSubmitForm}>
        <UploadAvatar currentAvatar={logoFile} onChange={handleLogoChange} />

        <EASTextField
          type='text'
          containerClass={styles.textField}
          fieldLabel={textForKey('clinic name')}
          value={clinicName}
          onChange={handleNameChange}
          helperText={textForKey('insert_at_least_3_characters')}
        />

        <EASTextField
          type='text'
          containerClass={styles.textField}
          fieldLabel={textForKey('domain name')}
          error={domainName.length > 0 && !isDomainAvailable}
          value={domainName}
          onChange={handleDomainChange}
          endAdornment={
            <Typography noWrap className={styles.domainAdornment}>
              .easyplan.pro
            </Typography>
          }
        />

        <EASTextField
          type='text'
          containerClass={styles.textField}
          fieldLabel={`${textForKey('website')} (${textForKey(
            'optional',
          ).toLowerCase()})`}
          value={website}
          onChange={handleWebsiteChange}
        />

        <EASSelect
          rootClass={styles.textField}
          label={textForKey('country')}
          labelId='clinic-country-select'
          disabled={countries.length === 0}
          options={mappedCountries}
          value={country?.id || -1}
          onChange={handleCountryChange}
        />

        <EASSelect
          rootClass={styles.textField}
          label={textForKey('currency')}
          labelId='clinic-currency-select'
          disabled={currencies.length === 0}
          value={defaultCurrency}
          options={mappedCurrencies}
          onChange={handleCurrencyChange}
        />

        <EASSelect
          rootClass={styles.textField}
          label={textForKey('time zone')}
          labelId='time-zone-select'
          disabled={timeZones.length === 0}
          value={timeZone}
          options={mappedTimeZones}
          onChange={handleTimeZoneChange}
        />

        <EASTextarea
          type='text'
          containerClass={styles.textField}
          fieldLabel={`${textForKey('about clinic')} (${textForKey(
            'optional',
          ).toLowerCase()})`}
          value={description}
          onChange={handleDescriptionChange}
        />

        <div className={styles.footer}>
          <Box className={styles.backButton} onClick={handleGoBack}>
            {redirect
              ? `${textForKey('already have an account')}?`
              : textForKey('go back')}
          </Box>
          <LoadingButton
            onClick={handleSubmitForm}
            isLoading={isLoading}
            className='positive-button'
            disabled={!isFormValid}
          >
            {redirect
              ? textForKey('create new account')
              : textForKey('create clinic')}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default CreateClinicForm;
