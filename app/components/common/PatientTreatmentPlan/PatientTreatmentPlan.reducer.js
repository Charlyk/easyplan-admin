import { createSlice } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';

export const initialState = {
  toothServices: [],
  allServices: [],
};

const treatmentPlanSlice = createSlice({
  name: 'patientTreatmentPlan',
  initialState,
  reducers: {
    setInitialData(state, action) {
      const { services } = action.payload;
      const mapped = services.map((item) => ({
        ...item,
        teeth: item.teeth.map((tooth) => tooth.replace('_', '')),
      }));
      const ordered = orderBy(
        mapped,
        ['created', 'completed'],
        ['desc', 'asc'],
      );
      state.allServices = ordered;
      state.toothServices = ordered.filter((item) => item.teeth.length > 0);
    },
  },
});

export const { setInitialData } = treatmentPlanSlice.actions;

export default treatmentPlanSlice.reducer;
