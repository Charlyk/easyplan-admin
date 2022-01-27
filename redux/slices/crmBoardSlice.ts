import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { DealStateView, DealView, GroupedDeals } from 'types';

const crmBoardSlice = createSlice({
  name: 'crmBoard',
  initialState: initialState.crmBoard,
  reducers: {
    dispatchFetchDealStates(state, _action: PayloadAction<boolean>) {
      state.isFetchingStates = true;
    },
    dispatchFetchRemindersCount(state) {
      state.isFetchingRemindersCount = true;
    },
    dispatchFetchGroupedDeals(
      state,
      _action: PayloadAction<{ page: number; itemsPerPage: number }>,
    ) {
      state.isFetchingDeals = true;
    },
    setRemindersCount(state, action: PayloadAction<number>) {
      state.remindersCount = action.payload;
      state.isFetchingRemindersCount = false;
    },
    setGroupedDeals(state, action: PayloadAction<GroupedDeals[]>) {
      state.deals = action.payload;
      state.isFetchingDeals = false;
    },
    addGroupedDeals(state, action: PayloadAction<GroupedDeals[]>) {
      state.deals = state.deals.map((group) => {
        const remoteGroup = action.payload.find(
          (item) => item.state.id === group.state.id,
        );
        if (remoteGroup == null) {
          return group;
        }

        return {
          ...group,
          deals: {
            ...group.deals,
            data: [...group.deals.data, ...remoteGroup.deals.data],
          },
        };
      });
      state.isFetchingDeals = false;
    },
    setDealStates(state, action: PayloadAction<DealStateView[]>) {
      state.states = orderBy(action.payload, ['orderId'], ['asc']);
      state.isFetchingStates = false;
    },
    updateDeal(state, action: PayloadAction<DealView>) {
      state.deals = state.deals.map((group) => {
        const hasDeal = group.deals.data.some(
          (deal) => deal.id === action.payload.id,
        );
        if (group.state.id !== action.payload.state.id || !hasDeal) {
          return group;
        }
        const deals = group.deals.data.map((deal) => {
          if (deal.id !== action.payload.id) {
            return deal;
          }
          return {
            ...deal,
            ...action.payload,
          };
        });
        return {
          ...group,
          deals: {
            ...group.deals,
            data: deals,
          },
        };
      });
    },
    addNewDeal(state, action: PayloadAction<DealView>) {
      state.deals = state.deals.map((group) => {
        const hasDeal = group.deals.data.some(
          (deal) => deal.id === action.payload.id,
        );
        if (group.state.id !== action.payload.state.id || hasDeal) {
          return group;
        }
        return {
          ...group,
          deals: {
            ...group.deals,
            data: [action.payload, ...group.deals.data],
            total: group.deals.total + 1,
          },
        };
      });
    },
    deleteDeal(state, action: PayloadAction<DealView>) {
      state.deals = state.deals.map((group) => {
        const hasDeal = group.deals.data.some(
          (deal) => deal.id === action.payload.id,
        );
        if (group.state.id !== action.payload.state.id || hasDeal) {
          return group;
        }
        return {
          ...group,
          deals: {
            ...group.deals,
            data: group.deals.data.filter(
              (item) => item.id !== action.payload.id,
            ),
            total: group.deals.total - 1,
          },
        };
      });
    },
    movedDeal(
      state,
      action: PayloadAction<{ initial: DealView; current: DealView }>,
    ) {
      const { initial, current } = action.payload;
      state.deals = state.deals.map((group) => {
        if (
          group.state.id !== initial.state.id &&
          group.state.id !== current.state.id
        ) {
          return group;
        }
        if (group.state.id === initial.state.id) {
          return {
            ...group,
            deals: {
              ...group.deals,
              data: group.deals.data.filter((item) => item.id !== initial.id),
              total: group.deals.total - 1,
            },
          };
        } else if (group.state.id === current.state.id) {
          return {
            ...group,
            deals: {
              ...group.deals,
              data: [current, ...group.deals.data],
              total: group.deals.total + 1,
            },
          };
        }
      });
    },
    setUserDealStates(state, action: PayloadAction<DealStateView[]>) {
      state.userStates = action.payload;
      state.isFetchingStates = false;
    },
    setIsFetchingStates(state, action: PayloadAction<boolean>) {
      state.isFetchingStates = action.payload;
    },
    setIsFetchingRemindersCount(state, action: PayloadAction<boolean>) {
      state.isFetchingRemindersCount = action.payload;
    },
    setIsFetchingDeals(state, action: PayloadAction<boolean>) {
      state.isFetchingDeals = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.crmBoard,
      };
    },
  },
});

export const {
  dispatchFetchGroupedDeals,
  setIsFetchingDeals,
  setGroupedDeals,
  setDealStates,
  setUserDealStates,
  setIsFetchingStates,
  setRemindersCount,
  setIsFetchingRemindersCount,
  dispatchFetchDealStates,
  dispatchFetchRemindersCount,
  updateDeal,
  addNewDeal,
  deleteDeal,
  movedDeal,
  addGroupedDeals,
} = crmBoardSlice.actions;

export default crmBoardSlice.reducer;
