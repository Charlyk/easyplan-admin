import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { ClinicSettings } from 'types';

const clinicSettingsSlice = createSlice({
  name: 'clinicSettings',
  initialState: initialState.clinicSettings,
  reducers: {
    dispatchFetchSettings(state) {
      state.isFetching = true;
    },
    setClinicSettings(state, action: PayloadAction<ClinicSettings>) {
      state.settings = action.payload;
      state.isFetching = false;
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
  },
});

export const { dispatchFetchSettings, setIsFetching, setClinicSettings } =
  clinicSettingsSlice.actions;

export default clinicSettingsSlice.reducer;
