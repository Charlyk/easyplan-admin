import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PaymentSubscription } from 'types/api';
import initialState from '../initialState';

const paymentSlice = createSlice({
  name: 'paymentsSlice',
  initialState: initialState.payments,
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
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  dispatchFetchSubscriptionInfo,
  setSubscriptionInfo,
  setSubscriptionInfoError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
