import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const paymentsRootSelector = (state: ReduxState) => state.paymentsState;

export const paymentsSubscriptionSelector = createSelector(
  paymentsRootSelector,
  (payments) => payments.subscriptionInfo,
);

export const paymentsPaymentMethodsSelector = createSelector(
  paymentsRootSelector,
  (payments) => payments.paymentMethods,
);

export const paymentsActionSelector = createSelector(
  paymentsRootSelector,
  (payments) => payments.paymentActions,
);

export const paymentsInvoicesSelector = createSelector(
  paymentsRootSelector,
  (payments) => payments.invoicesInfo,
);

export const paymentsNewCardModalSelector = createSelector(
  paymentsRootSelector,
  (payments) => payments.modalOpen,
);

export const isPaymentDataLoadingSelector = createSelector(
  paymentsRootSelector,
  (payments) => payments.isDataLoading,
);
