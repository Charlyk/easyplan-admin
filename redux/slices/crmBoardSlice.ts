import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import {
  CrmDealDetailsType,
  CrmDealListItemType,
  DealStateView,
  GroupedDeals,
} from 'types';
import {
  CreateDealStateRequest,
  UpdateDealStateRequest,
  UpdateDealStateResponse,
} from 'types/api';

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
    dispatchUpdateDealState(
      state,
      _action: PayloadAction<{ stateId: number; body: UpdateDealStateRequest }>,
    ) {
      state.isFetchingStates = true;
    },
    dispatchCreateDealState(
      state,
      _action: PayloadAction<CreateDealStateRequest>,
    ) {
      state.isFetchingStates = true;
    },
    dispatchDeleteDealState(state, _action: PayloadAction<number>) {
      state.isFetchingStates = true;
    },
    dispatchFetchGroupedDeals(
      state,
      _action: PayloadAction<{ page: number; itemsPerPage: number }>,
    ) {
      state.isFetchingDeals = true;
    },
    dispatchFetchDealDetails(state, _action: PayloadAction<number>) {
      state.isFetchingDetails = true;
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
    updateDeal(state, action: PayloadAction<CrmDealListItemType>) {
      state.deals = state.deals.map((group) => {
        const hasDeal = group.deals.data.some(
          (deal) => deal.id === action.payload.id,
        );
        if (group.state.id !== action.payload.stateId || !hasDeal) {
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
    addNewDeal(state, action: PayloadAction<CrmDealListItemType>) {
      state.deals = state.deals.map((group) => {
        const hasDeal = group.deals.data.some(
          (deal) => deal.id === action.payload.id,
        );
        if (group.state.id !== action.payload.stateId || hasDeal) {
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
    deleteDeal(state, action: PayloadAction<CrmDealListItemType>) {
      state.deals = state.deals.map((group) => {
        const hasDeal = group.deals.data.some(
          (deal) => deal.id === action.payload.id,
        );
        if (group.state.id !== action.payload.stateId || hasDeal) {
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
      action: PayloadAction<{
        initial: CrmDealListItemType;
        current: CrmDealListItemType;
      }>,
    ) {
      const { initial, current } = action.payload;
      state.deals = state.deals.map((group) => {
        if (
          group.state.id !== initial.stateId &&
          group.state.id !== current.stateId
        ) {
          return group;
        }
        if (group.state.id === initial.stateId) {
          return {
            ...group,
            deals: {
              ...group.deals,
              data: group.deals.data.filter((item) => item.id !== initial.id),
              total: group.deals.total - 1,
            },
          };
        } else if (group.state.id === current.stateId) {
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
    updateDealState(state, action: PayloadAction<DealStateView[]>) {
      state.deals = state.deals.map((group) => {
        const dealState = action.payload.find(
          (item) => item.id === group.state.id,
        );
        if (dealState == null) {
          return group;
        }

        return {
          ...group,
          state: dealState,
        };
      });
      state.isFetchingStates = false;
    },
    addDealState(state, action: PayloadAction<UpdateDealStateResponse>) {
      const newDeals = state.deals.map((group) => {
        const state = action.payload.all.find(
          (item) => group.state.id === item.id,
        );
        if (state == null) {
          return group;
        }
        return { ...group, state };
      });
      newDeals.push({
        state: action.payload.updated,
        deals: { total: 0, data: [] },
      });
      state.deals = sortBy(newDeals, (item) => item.state.orderId);
      state.isFetchingStates = false;
    },
    removeDealState(state, action: PayloadAction<UpdateDealStateResponse>) {
      state.deals = state.deals.filter(
        (item) => item.state.id !== action.payload.updated.id,
      );
      state.deals = state.deals.map((group) => {
        const state = action.payload.all.find(
          (item) => group.state.id === item.id,
        );
        if (state == null) {
          return group;
        }
        return { ...group, state };
      });
      state.isFetchingStates = false;
    },
    setDealDetails(state, action: PayloadAction<CrmDealDetailsType | null>) {
      state.dealDetails = action.payload;
      state.isFetchingDetails = false;
    },
    setIsFetchingDetails(state, action: PayloadAction<boolean>) {
      state.isFetchingDetails = action.payload;
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
  dispatchUpdateDealState,
  dispatchCreateDealState,
  dispatchDeleteDealState,
  dispatchFetchDealDetails,
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
  updateDealState,
  addDealState,
  setDealDetails,
  setIsFetchingDetails,
  removeDealState,
} = crmBoardSlice.actions;

export default crmBoardSlice.reducer;
