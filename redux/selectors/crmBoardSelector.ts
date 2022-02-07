import sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';
import { CrmDealListItemType, DealStateView, GroupedDeals } from 'types';
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

export const groupedDealsSelector = createSelector(crmBoardSelector, (board) =>
  sortBy(board?.deals ?? [], (item) => item.state.orderId),
);

export const dealsForStateSelector = createSelector(
  groupedDealsSelector,
  (state, dealState: DealStateView) => dealState,
  (groups, dealState): { total: number; data: CrmDealListItemType[] } => {
    return (
      groups.find((group) => group.state.id === dealState.id)?.deals ?? {
        total: 0,
        data: [],
      }
    );
  },
);

export const dealDetailsSelector = createSelector(
  crmBoardSelector,
  (board) => board.dealDetails,
);

export const isFetchingDetailsSelector = createSelector(
  crmBoardSelector,
  (board) => board.isFetchingDetails,
);

export const isFetchingDealsSelector = createSelector(
  crmBoardSelector,
  (board) => board.isFetchingDeals,
);
