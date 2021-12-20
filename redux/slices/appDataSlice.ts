import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { AppDataState } from 'redux/types';
import { CurrentClinic } from 'types';
import { UpdateProfileRequest } from 'types/api';
import { CurrentUser } from 'types/currentUser.type';

const appDataSlice = createSlice({
  name: 'appData',
  initialState: initialState.appData,
  reducers: {
    requestUpdateCurrentClinic(state, _action: PayloadAction<string>) {
      state.isUpdatingClinic = true;
    },
    setCurrentClinic(state, action: PayloadAction<CurrentClinic>) {
      state.currentClinic = action.payload;
      state.isUpdatingClinic = false;
    },
    setCurrentUser(state, action: PayloadAction<CurrentUser>) {
      state.currentUser = action.payload;
    },
    setAuthToken(state, action: PayloadAction<string>) {
      state.authToken = action.payload;
    },
    setCookies(state, action: PayloadAction<string>) {
      state.cookies = action.payload;
    },
    setAppData(state, action: PayloadAction<AppDataState>) {
      state.currentClinic = action.payload.currentClinic;
      state.currentUser = action.payload.currentUser;
      state.authToken = action.payload.authToken;
      state.cookies = action.payload.cookies;
      state.isUpdatingClinic = false;
      state.isUpdatingProfile = false;
    },
    setIsUpdatingProfile(state, action: PayloadAction<boolean>) {
      state.isUpdatingProfile = action.payload;
    },
    setIsUpdatingClinic(state, action: PayloadAction<boolean>) {
      state.isUpdatingClinic = action.payload;
    },
    updateUserProfile(state, _action: PayloadAction<UpdateProfileRequest>) {
      state.isUpdatingProfile = true;
    },
  },
});

export const {
  setCurrentClinic,
  setCurrentUser,
  setAppData,
  setCookies,
  setAuthToken,
  setIsUpdatingProfile,
  updateUserProfile,
  requestUpdateCurrentClinic,
  setIsUpdatingClinic,
} = appDataSlice.actions;

export default appDataSlice.reducer;
