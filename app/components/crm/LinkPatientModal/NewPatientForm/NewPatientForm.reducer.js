import { createSlice } from '@reduxjs/toolkit';
import { parsePhoneNumber } from 'libphonenumber-js';
import { textForKey } from 'app/utils/localization';

export const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  language: { id: 'ro', name: 'Româna' },
  source: { id: 'Unknown', name: textForKey('Unknown') },
  isPhoneValid: false,
  phoneCountry: { countryCode: 'md', dialCode: '373' },
  email: '',
  birthday: null,
};

const newPatientFormSlice = createSlice({
  name: 'newPatientForm',
  initialState,
  reducers: {
    setFirstName(state, action) {
      state.firstName = action.payload;
    },
    setLastName(state, action) {
      state.lastName = action.payload;
    },
    setPhoneNumber(state, action) {
      const { phoneNumber, isPhoneValid, country } = action.payload;
      state.phoneNumber = phoneNumber;
      state.phoneCountry = country;
      state.isPhoneValid = isPhoneValid;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setBirthday(state, action) {
      state.birthday = action.payload;
    },
    setContact(state, action) {
      try {
        state.email = action.payload.email ?? '';
        const payloadNumber = action.payload.phoneNumber;
        if (payloadNumber != null) {
          const phoneWithPlus = action.payload.phoneNumber.startsWith('+')
            ? action.payload.phoneNumber.trim()
            : `+${action.payload.phoneNumber.trim()}`;
          const phoneNumber = parsePhoneNumber(phoneWithPlus);
          state.phoneNumber = action.payload.phoneNumber
            ? phoneNumber.nationalNumber
            : '';
        }
        const [firstName, lastName] = action.payload.name.split(' ');
        state.firstName = firstName;
        state.lastName = lastName;
      } catch (error) {
        console.error(error);
      }
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setPatientSource(state, action) {
      state.source = action.payload;
    },
  },
});

export const {
  setFirstName,
  setEmail,
  setBirthday,
  setPhoneNumber,
  setLastName,
  setContact,
  setLanguage,
  setPatientSource,
} = newPatientFormSlice.actions;

export default newPatientFormSlice.reducer;
