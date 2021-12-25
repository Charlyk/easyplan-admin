import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { AppDataState } from 'redux/types';
import { Cabinet, ClinicUser, CurrentClinic } from 'types';
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
    dispatchChangeCabinetCalendarOrder(
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
    updateDoctorCalendarOrder(state, action: PayloadAction<ClinicUser>) {
      state.currentClinic.users = state.currentClinic.users.map((user) => {
        if (user.id !== action.payload.id) {
          return user;
        }
        return {
          ...user,
          calendarOrderId: action.payload.calendarOrderId,
        };
      });
    },
    updateCabinetCalendarOrder(state, action: PayloadAction<Cabinet>) {
      state.currentClinic.cabinets = state.currentClinic.cabinets.map(
        (cabinet) => {
          if (cabinet.id !== action.payload.id) {
            return cabinet;
          }
          return {
            ...cabinet,
            calendarOrderId: action.payload.calendarOrderId,
          };
        },
      );
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
  dispatchChangeDoctorCalendarOrder,
  updateDoctorCalendarOrder,
  dispatchChangeCabinetCalendarOrder,
  updateCabinetCalendarOrder,
} = appDataSlice.actions;

export default appDataSlice.reducer;
