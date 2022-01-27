import { createSelector } from 'reselect';
import { DealStateView } from '../../types';
import { ReduxState } from '../types';

export const crmBoardSelector = (state: ReduxState) => state.crmBoard;

export const crmDealsStatesSelector = createSelector(
  crmBoardSelector,
  (board) => board?.states ?? [],
);

export const crmUserDealStatesSelector = createSelector(
  crmBoardSelector,
  (board) => board.userStates ?? [],
);

export const remindersCountSelector = createSelector(
  crmBoardSelector,
  (board) => board?.remindersCount ?? 0,
);

export const groupedDealsSelector = createSelector(
  crmBoardSelector,
  (board) => board?.deals ?? [],
);

export const dealsForStateSelector = createSelector(
  groupedDealsSelector,
  (state, dealState: DealStateView) => dealState,
  (groups, dealState) => {
    return groups.find((group) => group.state.id === dealState.id)?.deals ?? [];
  },
);

export const isFetchingDealsSelector = createSelector(
  crmBoardSelector,
  (board) => board.isFetchingDeals,
);
