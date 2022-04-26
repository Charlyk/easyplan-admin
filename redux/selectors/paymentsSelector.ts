import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const paymentsRootSelector = (state: ReduxState) => state.payments;

export const paymentsSubscriptionSelector = createSelector(
  paymentsRootSelector,
  (payments) => payments.subscriptionInfo,
);
