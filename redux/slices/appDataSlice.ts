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
    setCurrentClinic(state, action: PayloadAction<CurrentClinic>) {
      state.currentClinic = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<CurrentUser>) {
      state.currentUser = action.payload;
    },
    setAuthToken(state, action: PayloadAction<string>) {
      state.authToken = action.payload;
    },
    setAppData(state, action: PayloadAction<AppDataState>) {
      state.currentClinic = action.payload.currentClinic;
      state.currentUser = action.payload.currentUser;
      state.authToken = action.payload.authToken;
    },
    setIsUpdatingProfile(state, action: PayloadAction<boolean>) {
      state.isUpdatingProfile = action.payload;
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
  setAuthToken,
  setIsUpdatingProfile,
  updateUserProfile,
} = appDataSlice.actions;

export default appDataSlice.reducer;
