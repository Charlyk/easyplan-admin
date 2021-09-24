import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isPhoneValid: false,
  phoneCountry: { countryCode: 'md', dialCode: '373' },
  email: '',
  birthday: null,
}

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
      state.email = action.payload.email ?? ''
      state.phoneNumber = action.payload.phoneNumber ?? ''
      const [firstName, lastName] = action.payload.name.split(' ');
      state.firstName = firstName;
      state.lastName = lastName;
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
} = newPatientFormSlice.actions;

export default newPatientFormSlice.reducer;
