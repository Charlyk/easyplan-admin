import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { AppDataState } from 'redux/types';
import { AppLocale, CurrentClinic } from 'types';
import {
  AppDataRequest,
  AppDataResponse,
  DoctorCalendarOrderRequest,
  UpdateProfileRequest,
} from 'types/api';
import { AuthenticationResponse } from 'types/api/response';
import { CurrentUser } from 'types/currentUser.type';

const appDataSlice = createSlice({
  name: 'appData',
  initialState: initialState.appData,
  reducers: {
    dispatchChangeDoctorCalendarOrder(
      state,
      _action: PayloadAction<DoctorCalendarOrderRequest>,
    ) {
      state.isUpdatingClinic = false;
    },
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
      state.currentUser.clinics = state.currentUser.clinics.map((clinic) => {
        if (clinic.clinicId !== action.payload.id) {
          return clinic;
        }
        return {
          ...clinic,
          clinicName: action.payload.clinicName,
        };
      });
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
    updateIsEmailChanged(state, action: PayloadAction<boolean>) {
      state.isEmailChanged = action.payload;
    },
    dispatchUpdateUserLanguage(state, _action: PayloadAction<AppLocale>) {
      return state;
    },
    setNewAppLanguage(state, action: PayloadAction<AppLocale>) {
      state.currentUser = { ...state.currentUser, language: action.payload };
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
  dispatchChangeDoctorCalendarOrder,
  updateIsEmailChanged,
  dispatchUpdateUserLanguage,
  setNewAppLanguage,
} = appDataSlice.actions;

export default appDataSlice.reducer;
