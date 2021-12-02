import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { CurrentClinic } from 'types';
import { CurrentUser } from 'types/currentUser.type';
import initialState from '../initialState';
import { AppDataState } from '../types';

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
    setAppData(state, action: PayloadAction<AppDataState>) {
      state.currentClinic = action.payload.currentClinic;
      state.currentUser = action.payload.currentUser;
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

export const { setCurrentClinic, setCurrentUser, setAppData } =
  appDataSlice.actions;

export default appDataSlice.reducer;
