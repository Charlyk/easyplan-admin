import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const createReminderModalSelector = (state: ReduxState) =>
  state.createReminderModal;

export const isCreatingNewReminderSelector = createSelector(
  createReminderModalSelector,
  (state) => state.isLoading,
);
