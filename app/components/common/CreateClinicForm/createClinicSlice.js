import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

export const charactersRegex = /[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/#@а-яА-Я]/gi;

export const initialState = {
  logoFile: null,
  clinicName: '',
  domainName: '',
  website: '',
  description: '',
  countryIso: 'md',
  country: null,
  defaultCurrency: 'MDL',
  timeZone: moment.tz.guess(true),
  timeZones: [],
  currencies: [],
  isDomainAvailable: false,
};

const createClinicSlice = createSlice({
  name: 'createClinic',
  initialState,
  reducers: {
    setLogoFile(state, action) {
      state.logoFile = action.payload;
    },
    setClinicName(state, action) {
      state.clinicName = action.payload;
      state.domainName = action.payload
        .toLowerCase()
        .replaceAll(charactersRegex, '')
        .replaceAll(' ', '-')
        .replaceAll('ă', 'a')
        .replaceAll('ș', 's')
        .replaceAll('ț', 't')
        .replaceAll('î', 'i')
        .replaceAll('â', 'a');
    },
    setWebsite(state, action) {
      state.website = action.payload;
    },
    setDescription(state, action) {
      state.description = action.payload;
    },
    setTimeZone(state, action) {
      state.timeZone = action.payload;
    },
    setTimeZones(state, action) {
      state.timeZones = action.payload;
    },
    setDomainName(state, action) {
      state.domainName = action.payload
        .toLowerCase()
        .replaceAll(charactersRegex, '')
        .replaceAll(' ', '-')
        .replaceAll('ă', 'a')
        .replaceAll('ș', 's')
        .replaceAll('ț', 't')
        .replaceAll('î', 'i')
        .replaceAll('â', 'a');
    },
    setInitialData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setDefaultCurrency(state, action) {
      state.defaultCurrency = action.payload;
    },
    setIsDomainAvailable(state, action) {
      state.isDomainAvailable = action.payload;
    },
    setCountryIso(state, action) {
      state.countryIso = action.payload;
    },
    setCountry(state, action) {
      state.country = action.payload;
    },
  },
});

export const {
  setLogoFile,
  setClinicName,
  setWebsite,
  setDescription,
  setTimeZone,
  setTimeZones,
  setDomainName,
  setInitialData,
  setDefaultCurrency,
  setIsDomainAvailable,
  setCountry,
} = createClinicSlice.actions;

export default createClinicSlice.reducer;
