import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

const clinicDataSlice = createSlice({
  name: 'clinicData',
  initialState: initialState.clinicData,
  reducers: {
    setShouldUpdateClinicData(state, action) {
      state.updateClinicData = action.payload;
    },
  },
});

export const {
  setShouldUpdateClinicData,
} = clinicDataSlice.actions;

export default clinicDataSlice.reducer;
