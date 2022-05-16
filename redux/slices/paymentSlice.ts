import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import {
  PaymentSubscription,
  PaymentMethod,
  PaymentInvoices,
  PaymentCardData,
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
      state.isDataLoading = false;
      if (!action.payload) {
        state.subscriptionInfo.data = action.payload;
      }
    },
    setSubscriptionInfoError(state, action: PayloadAction<string | null>) {
      state.subscriptionInfo.loading = false;
      state.isDataLoading = false;
      state.subscriptionInfo.error = action.payload;
    },
    dispatchFetchPaymentMethods(state) {
      state.paymentMethods.loading = true;
    },
    setPaymentMethods(state, action: PayloadAction<PaymentMethod[]>) {
      state.paymentMethods.data = action.payload;
      state.paymentMethods.loading = false;
      state.isDataLoading = false;
    },
    setPaymentMethodsError(state, action: PayloadAction<string | null>) {
      state.paymentMethods.loading = false;
      state.isDataLoading = false;
      state.paymentMethods.error = action.payload;
    },
    dispatchFetchInvoices(state) {
      state.invoicesInfo.loading = true;
    },
    setInvoices(state, action: PayloadAction<PaymentInvoices[]>) {
      state.invoicesInfo.loading = false;
      state.isDataLoading = false;
      state.invoicesInfo.data = action.payload;
    },
    setInvoicesError(state, action: PayloadAction<string | null>) {
      state.invoicesInfo.loading = false;
      state.isDataLoading = false;
      state.invoicesInfo.error = action.payload;
    },
    dispatchAddNewPaymentMethod(
      state,
      _action: PayloadAction<PaymentCardData>,
    ) {
      state.isDataLoading = true;
    },
    dispatchDeletePaymentMethod(state, _action: PayloadAction<{ id: string }>) {
      state.isDataLoading = true;
    },
    deletePaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.isDataLoading = false;
      state.paymentMethods.data = state.paymentMethods.data.filter(
        (method) => method.id !== action.payload.id,
      );
    },
    dispatchSetPaymentMethodAsDefault(
      state,
      _action: PayloadAction<{ id: string }>,
    ) {
      state.isDataLoading = true;
    },
    setPaymentMethodAsDefault(state, action: PayloadAction<{ id: string }>) {
      state.isDataLoading = false;
      state.paymentMethods.data = state.paymentMethods.data.map((method) =>
        method.id === action.payload.id
          ? { ...method, isDefault: true }
          : { ...method, isDefault: false },
      );
    },
    dispatchPurchaseSeats(
      state,
      _action: PayloadAction<{ seats: number; interval: 'MONTH' | 'YEAR' }>,
    ) {
      state.isDataLoading = true;
    },
    dispatchRemoveSeats(state, _action: PayloadAction<{ seats: number }>) {
      state.isDataLoading = true;
    },
    dispatchChangeBillingPeriod(
      state,
      _action: PayloadAction<{ period: 'MONTH' | 'YEAR' }>,
    ) {
      state.isDataLoading = true;
    },
    dispatchCancelSubcription(state) {
      state.isDataLoading = true;
    },
    clearPaymentMethodsError(state) {
      state.paymentMethods.error = null;
    },
    dispatchRetryPayment(state) {
      state.isDataLoading = true;
    },
    openNewCardModal(state) {
      state.modalOpen = true;
    },
    closeNewCardModal(state) {
      state.modalOpen = false;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.paymentsState,
      };
    },
  },
});

export const {
  dispatchAddNewPaymentMethod,
  dispatchFetchSubscriptionInfo,
  dispatchRetryPayment,
  dispatchSetPaymentMethodAsDefault,
  dispatchChangeBillingPeriod,
  dispatchCancelSubcription,
  setSubscriptionInfo,
  setSubscriptionInfoError,
  dispatchFetchPaymentMethods,
  setPaymentMethods,
  setPaymentMethodsError,
  dispatchFetchInvoices,
  setInvoices,
  setInvoicesError,
  openNewCardModal,
  closeNewCardModal,
  dispatchDeletePaymentMethod,
  setPaymentMethodAsDefault,
  dispatchPurchaseSeats,
  dispatchRemoveSeats,
  clearPaymentMethodsError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
