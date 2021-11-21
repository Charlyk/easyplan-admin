import { createSlice } from '@reduxjs/toolkit';

export const RegistrationStep = {
  Account: 0,
  Clinic: 1,
};

export const initialState = {
  step: RegistrationStep.Account,
  isLoading: false,
  errorMessage: null,
  completedSteps: [],
  accountData: null,
  clinicData: null,
};

const registrationWrapperSlice = createSlice({
  name: 'registrationWrapper',
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    setAccountCompleted(state) {
      state.step = RegistrationStep.Clinic;
      state.completedSteps = [RegistrationStep.Account];
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    setCompletedSteps(state, action) {
      state.completedSteps = action.payload;
    },
    setAccountData(state, action) {
      state.accountData = action.payload;
    },
    setClinicData(state, action) {
      state.clinicData = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setErrorMessage,
  setCompletedSteps,
  setAccountData,
} = registrationWrapperSlice.actions;

export default registrationWrapperSlice.reducer;
