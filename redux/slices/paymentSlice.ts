import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaymentSubscription,
  PaymentMethods,
  PaymentInvoices,
} from 'types/api';
import initialState from '../initialState';

const paymentSlice = createSlice({
  name: 'paymentsSlice',
  initialState: initialState.paymentsState,
  reducers: {
    dispatchFetchSubscriptionInfo(state) {
      state.subscriptionInfo.loading = true;
    },
    setSubscriptionInfo(state, action: PayloadAction<PaymentSubscription>) {
      state.subscriptionInfo.loading = false;
      state.subscriptionInfo.data = action.payload;
    },
    setSubscriptionInfoError(state, action: PayloadAction<string | null>) {
      state.subscriptionInfo.loading = false;
      state.subscriptionInfo.error = action.payload;
    },
    dispatchFetchPaymentMethods(state) {
      state.paymentMethods.loading = true;
    },
    setPaymentMethods(state, action: PayloadAction<PaymentMethods[]>) {
      state.paymentMethods.data = action.payload;
      state.paymentMethods.loading = false;
    },
    setPaymentMethodsError(state, action: PayloadAction<string | null>) {
      state.paymentMethods.loading = false;
      state.paymentMethods.error = action.payload;
    },
    dispatchFetchInvoices(state) {
      state.invoicesInfo.loading = true;
    },
    setInvoices(state, action: PayloadAction<PaymentInvoices[]>) {
      state.invoicesInfo.loading = false;
      state.invoicesInfo.data = action.payload;
    },
    setInvoicesError(state, action: PayloadAction<string | null>) {
      state.invoicesInfo.loading = false;
      state.invoicesInfo.error = action.payload;
    },
  },

  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state.paymentsSlice,
  //       ...action.payload.paymentsSlice,
  //     };
  //   },
  // },
});

export const {
  dispatchFetchSubscriptionInfo,
  setSubscriptionInfo,
  setSubscriptionInfoError,
  dispatchFetchPaymentMethods,
  setPaymentMethods,
  setPaymentMethodsError,
  dispatchFetchInvoices,
  setInvoices,
  setInvoicesError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
