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
        tooth: item.tooth?.replace('_', ''),
      }));
      const ordered = orderBy(
        mapped,
        ['completed', 'created'],
        ['asc', 'desc'],
      );
      state.allServices = ordered;
      state.toothServices = ordered.filter((item) => item.tooth != null);
    },
  },
});

export const { setInitialData } = treatmentPlanSlice.actions;

export default treatmentPlanSlice.reducer;
