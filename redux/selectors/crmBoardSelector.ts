import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const crmBoardSelector = (state: ReduxState) => state.crmBoard;

export const crmDealsStatesSelector = createSelector(
  crmBoardSelector,
  (board) => board.states ?? [],
);

export const remindersCountSelector = createSelector(
  crmBoardSelector,
  (board) => board.remindersCount ?? 0,
);
