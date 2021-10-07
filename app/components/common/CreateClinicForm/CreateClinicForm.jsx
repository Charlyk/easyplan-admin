import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import clsx from "clsx";
import sortBy from 'lodash/sortBy';
import debounce from "lodash/debounce";
import { toast } from "react-toastify";
import Typography from "@material-ui/core/Typography";

import { isDev } from "../../../../eas.config";
import { textForKey } from "../../../../utils/localization";
import { WebRegex } from "../../../utils/constants";
import {
  checkDomainAvailability,
  clinicTimeZones,
  fetchAvailableCurrencies
} from "../../../../middleware/api/clinic";
import LoadingButton from "../LoadingButton";

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
} from './createClinicSlice'
import EASTextField from "../EASTextField";
import UploadAvatar from "../UploadAvatar";
import EASSelect from "../EASSelect";
import styles from "./CreateClinicForm.module.scss";
import EASTextarea from "../EASTextarea";

const CreateClinicForm = ({ isLoading, isMobile, redirect, countries, onGoBack, onSubmit }) => {
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
    country,
  }, localDispatch] = useReducer(reducer, initialState);

  const mappedCountries = useMemo(() => {
    return countries.map((item) => ({
      ...item,
      label: item.name,
    }))
  }, [countries]);

  const mappedCurrencies = useMemo(() => {
    return currencies.map((item) => ({
      ...item,
      name: `${item.id} - ${item.name}`,
    }));
  }, [currencies]);

  const mappedTimeZones = useMemo(() => {
    return sortBy(timeZones.map((item) => ({
      id: item,
      name: item,
    })), item => item.name);
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
  }

  const handleDomainChange = (newDomain) => {
    localDispatch(setDomainName(newDomain.toLowerCase()));
  }

  const handleWebsiteChange = (newValue) => {
    localDispatch(setWebsite(newValue));
  }

  const handleTimeZoneChange = (event) => {
    localDispatch(setTimeZone(event.target.value));
  }

  const handleDescriptionChange = (newValue) => {
    localDispatch(setDescription(newValue));
  }

  const handleCurrencyChange = (event) => {
    localDispatch(setDefaultCurrency(event.target.value));
  }

  const handleCountryChange = (event) => {
    const country = countries.find(item => item.id === event.target.value);
    localDispatch(setCountry(country));
  }

  const handleLogoChange = (file) => {
    if (file != null) {
      localDispatch(setLogoFile(file));
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
      defaultCurrency &&
      timeZone &&
      country != null &&
      clinicName.length > 3 &&
      domainName.length > 3 &&
      isDomainAvailable &&
      (website.length === 0 || website.match(WebRegex))
    )
  }, [
    website,
    clinicName,
    domainName,
    country,
    defaultCurrency,
    timeZone,
    isDomainAvailable
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
      domainName: isDev ? `${domainName}-dev` : domainName,
      defaultCurrency,
    });
  }

  const handleGoBack = () => {
    onGoBack();
  }

  return (
    <div
      className={styles.registerForm}
      style={{
        padding: isMobile ? '1rem' : '2rem',
        width: isMobile ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
      }}
    >
      <span className={styles.formTitle}>{textForKey('Create clinic')}</span>
      <form onSubmit={handleSubmitForm}>
        <UploadAvatar
          currentAvatar={logoFile}
          onChange={handleLogoChange}
        />

        <EASTextField
          type="text"
          containerClass={styles.textField}
          fieldLabel={textForKey('Clinic name')}
          value={clinicName}
          onChange={handleNameChange}
        />

        <EASTextField
          type="text"
          containerClass={styles.textField}
          fieldLabel={textForKey('Domain name')}
          error={domainName.length > 0 && !isDomainAvailable}
          value={domainName}
          onChange={handleDomainChange}
          endAdornment={
            <Typography noWrap className={styles.domainAdornment}>
              {isDev ? '-dev' : ''}.easyplan.pro
            </Typography>
          }
        />

        <EASTextField
          type="text"
          containerClass={styles.textField}
          fieldLabel={`${textForKey('Website')} (${textForKey('optional',).toLowerCase()})`}
          value={website}
          onChange={handleWebsiteChange}
        />

        <EASSelect
          rootClass={styles.textField}
          label={textForKey('Country')}
          labelId="clinic-country-select"
          disabled={countries.length === 0}
          options={mappedCountries}
          value={country?.id || -1}
          onChange={handleCountryChange}
        />

        <EASSelect
          rootClass={styles.textField}
          label={textForKey('Currency')}
          labelId="clinic-currency-select"
          disabled={currencies.length === 0}
          value={defaultCurrency}
          options={mappedCurrencies}
          onChange={handleCurrencyChange}
        />

        <EASSelect
          rootClass={styles.textField}
          label={textForKey('Time zone')}
          labelId="time-zone-select"
          disabled={timeZones.length === 0}
          value={timeZone}
          options={mappedTimeZones}
          onChange={handleTimeZoneChange}
        />

        <EASTextarea
          type="text"
          containerClass={styles.textField}
          fieldLabel={`${textForKey('About clinic')} (${textForKey('optional').toLowerCase()})`}
          value={description}
          onChange={handleDescriptionChange}
        />

        <div className={styles.footer}>
          <div
            role='button'
            tabIndex={0}
            className={styles.backButton}
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
      </form>
    </div>
  )
}

export default CreateClinicForm;
