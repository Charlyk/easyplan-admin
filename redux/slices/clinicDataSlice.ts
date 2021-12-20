import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from '../initialState';

const clinicDataSlice = createSlice({
  name: 'clinicData',
  initialState: initialState.clinicData,
  reducers: {
    setShouldUpdateClinicData(state, action: PayloadAction<boolean>) {
      state.updateClinicData = action.payload;
    },
    setUserClinicAccessChange(state, action: PayloadAction<any>) {
      state.userClinicAccessChange = action.payload;
    },
  },
});

export const { setShouldUpdateClinicData, setUserClinicAccessChange } =
  clinicDataSlice.actions;

export default clinicDataSlice.reducer;
