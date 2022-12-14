import { createSlice } from '@reduxjs/toolkit';

export const FormType = {
  login: 'login',
  resetPassword: 'resetPassword',
};

export const initialState = {
  currentForm: FormType.login,
  isLoading: false,
  errorMessage: null,
  showBlockedAccess: false,
};

const loginWrapperSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setCurrentForm(state, action) {
      state.currentForm = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
      state.errorMessage = action.payload ? null : state.errorMessage;
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    setShowBlockedAccess(state, action) {
      state.isLoading = false;
      state.showBlockedAccess = action.payload;
    },
  },
});

export const {
  setCurrentForm,
  setIsLoading,
  setErrorMessage,
  setShowBlockedAccess,
} = loginWrapperSlice.actions;

export default loginWrapperSlice.reducer;
