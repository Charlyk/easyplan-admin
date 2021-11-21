import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isPhoneValid: true,
  password: '',
  avatarFile: null,
  isInvitationAccepted: false,
  isPasswordVisible: false,
};

const acceptClinicInvitationSlice = createSlice({
  name: 'acceptClinicInvitation',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setFirstName(state, action) {
      state.firstName = action.payload;
    },
    setLastName(state, action) {
      state.lastName = action.payload;
    },
    setPhoneNumber(state, action) {
      const { number, isValid } = action.payload;
      state.phoneNumber = number;
      state.isPhoneValid = isValid;
    },
    setIsPhoneValid(state, action) {
      state.isPhoneValid = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setAvatarFile(state, action) {
      state.avatarFile = action.payload;
    },
    setIsInvitationAccepted(state, action) {
      state.isInvitationAccepted = action.payload;
    },
    setIsPasswordVisible(state, action) {
      state.isPasswordVisible = action.payload;
    },
  },
});

export const {
  setIsInvitationAccepted,
  setFirstName,
  setPassword,
  setIsLoading,
  setLastName,
  setPhoneNumber,
  setAvatarFile,
  setIsPasswordVisible,
} = acceptClinicInvitationSlice.actions;

export default acceptClinicInvitationSlice.reducer;
