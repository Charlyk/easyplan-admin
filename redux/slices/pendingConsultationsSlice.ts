import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PendingConsultationsGetRequest,
  PendingConsultationsResponse,
} from '../../types/api';
import initialState from '../initialState';

const pendingConsultationsSlice = createSlice({
  name: 'pendingConsultations',
  initialState: initialState.pendingConsultations,
  reducers: {
    fetchPendingConsultations(
      state,
      action: PayloadAction<PendingConsultationsGetRequest>,
    ) {
      state.loading = true;
      state.error = null;
    },
    setPendingConsultations(
      state,
      action: PayloadAction<PendingConsultationsResponse>,
    ) {
      state.data = action.payload;
      state.loading = false;
    },
    setPendingConsultationsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchPendingConsultations,
  setPendingConsultations,
  setPendingConsultationsError,
} = pendingConsultationsSlice.actions;

export default pendingConsultationsSlice.reducer;
