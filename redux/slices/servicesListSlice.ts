import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import sortBy from 'lodash/sortBy';
import { ClinicService } from 'types';
import initialState from '../initialState';

const servicesListSlice = createSlice({
  name: 'servicesList',
  initialState: initialState.servicesList,
  reducers: {
    fetchServicesList(state) {
      state.isFetching = true;
    },
    setServicesData(
      state,
      action: PayloadAction<{ services: ClinicService[]; categories: any[] }>,
    ) {
      state.services = sortBy(action.payload.services, (item) =>
        item.name.toLowerCase(),
      );
      state.categories = sortBy(action.payload.categories, (item) =>
        item.name.toLowerCase(),
      );
      state.isFetching = false;
    },
    setCategories(state, action: PayloadAction<any[]>) {
      state.categories = action.payload;
      state.isFetching = false;
    },
    setServices(state, action: PayloadAction<ClinicService[]>) {
      state.services = action.payload;
      state.isFetching = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isFetching = false;
    },
  },
});

export const {
  fetchServicesList,
  setError,
  setServices,
  setCategories,
  setServicesData,
} = servicesListSlice.actions;

export default servicesListSlice.reducer;
