import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { AppDataState } from 'redux/types';
import { CurrentClinic } from 'types';
import {
  AppDataRequest,
  AppDataResponse,
  UpdateProfileRequest,
} from 'types/api';
import { AuthenticationResponse } from 'types/api/response';
import { CurrentUser } from 'types/currentUser.type';

const appDataSlice = createSlice({
  name: 'appData',
  initialState: initialState.appData,
  reducers: {
    dispatchFetchAppData(state, _action: PayloadAction<AppDataRequest>) {
      state.isAppInitialized = false;
    },
    setCurrentEntities(state, action: PayloadAction<AppDataResponse>) {
      state.currentUser = action.payload.currentUser;
      state.currentClinic = action.payload.currentClinic;
      state.isAppInitialized = true;
    },
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
    setAuthenticationData(
      state,
      action: PayloadAction<AuthenticationResponse>,
    ) {
      state.currentUser = action.payload.user;
      state.authToken = action.payload.token;
    },
    setCookies(state, action: PayloadAction<string>) {
      state.cookies = action.payload;
    },
    setAppData(state, action: PayloadAction<AppDataState>) {
      if (action.payload == null) {
        return;
      }
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
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.appData,
      };
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
  setAuthenticationData,
  dispatchFetchAppData,
  setCurrentEntities,
} = appDataSlice.actions;

export default appDataSlice.reducer;
