import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

export const initialState = {
  isSaving: false,
  showDatePicker: false,
  firstName: '',
  lastName: '',
  birthday: null,
  email: '',
  phoneNumber: '',
  discount: 0,
  euroDebt: 0,
  language: 'ro',
  source: 'Unknown',
  allTags: [],
  tags: [],
  country: {
    countryCode: 'md',
    dialCode: '373',
    format: '+... ... ... ... ... ..',
    name: 'Moldova',
  },
};

const patientPersonalDataSlice = createSlice({
  name: 'patientPersonaData',
  initialState,
  reducers: {
    setFirstName(state, action) {
      state.firstName = action.payload;
    },
    setLastName(state, action) {
      state.lastName = action.payload;
    },
    setBirthday(state, action) {
      state.birthday = action.payload;
      state.showDatePicker = false;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPhoneNumber(state, action) {
      const { isPhoneValid, newNumber, country } = action.payload;
      state.phoneNumber = newNumber;
      state.country = country;
      state.isPhoneValid = isPhoneValid;
    },
    setPatient(state, action) {
      const {
        firstName,
        lastName,
        birthday,
        email,
        phoneNumber,
        countryCode,
        discount,
        euroDebt,
        language,
        source,
        tags,
      } = action.payload;

      state.firstName = firstName;
      state.lastName = lastName;
      state.language = language;
      state.source = source;
      state.birthday = birthday ? moment(birthday).toDate() : null;
      state.email = email;
      state.phoneNumber = phoneNumber;
      state.country = { dialCode: countryCode, countryCode: 'md' };
      state.euroDebt = euroDebt;
      state.discount = String(discount || '0');
      state.isPhoneValid = true;
      state.tags = tags ?? [];
    },
    setShowDatePicker(state, action) {
      state.showDatePicker = action.payload;
    },
    setIsSaving(state, action) {
      state.isSaving = action.payload;
    },
    setDiscount(state, action) {
      state.discount = action.payload;
    },
    setEuroDebt(state, action) {
      state.euroDebt = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setSource(state, action) {
      state.source = action.payload;
    },
    setAllTags(state, action) {
      state.allTags = action.payload.map((item) => ({
        ...item,
        name: item.title,
      }));
    },
    setPatientTags(state, action) {
      state.tags = action.payload;
    },
    addPatientTag(state, action) {
      if (!state.tags.some((it) => it.id === action.payload.id)) {
        state.tags = [action.payload, ...state.tags];
      }
    },
    removeTag(state, action) {
      state.tags = state.tags.filter((it) => it.id !== action.payload.id);
    },
  },
});

export const {
  setShowDatePicker,
  setPatient,
  setFirstName,
  setIsSaving,
  setBirthday,
  setSource,
  setEmail,
  setLanguage,
  setDiscount,
  setEuroDebt,
  setPhoneNumber,
  setLastName,
  setAllTags,
  addPatientTag,
  removeTag,
} = patientPersonalDataSlice.actions;

export default patientPersonalDataSlice.reducer;
