import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { PatientPurchase, ShortInvoice } from 'types';

const patientPurchasesSlice = createSlice({
  name: 'patientPurchases',
  initialState: initialState.patientPurchases,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setPayments(state, action: PayloadAction<PatientPurchase[]>) {
      state.payments = action.payload;
      state.isLoading = false;
    },
    removePayments(state, action: PayloadAction<ShortInvoice>) {
      state.payments = state.payments.filter(
        (payment) => payment.invoiceId !== action.payload.id,
      );
      state.isLoading = false;
    },
    dispatchFetchPatientPurchases(state, _action: PayloadAction<number>) {
      state.isLoading = true;
    },
    dispatchUndoPayment(state, _action: PayloadAction<number>) {
      state.isLoading = false;
    },
  },
});

export const {
  setIsLoading,
  setPayments,
  dispatchFetchPatientPurchases,
  dispatchUndoPayment,
  removePayments,
} = patientPurchasesSlice.actions;

export default patientPurchasesSlice.reducer;
