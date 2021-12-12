import { createSelector } from 'reselect';

export const crmSelector = (state) => state.crm;

export const deletedDealSelector = createSelector(
  crmSelector,
  (crm) => crm?.deletedDeal,
);

export const updatedDealSelector = createSelector(
  crmSelector,
  (crm) => crm?.updatedDeal,
);

export const newDealSelector = createSelector(
  crmSelector,
  (crm) => crm?.newDeal,
);

export const updatedReminderSelector = createSelector(
  crmSelector,
  (crm) => crm?.updatedReminder,
);

export const newReminderSelector = createSelector(
  crmSelector,
  (crm) => crm?.newReminder,
);
