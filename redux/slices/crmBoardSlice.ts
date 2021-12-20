import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import initialState from 'redux/initialState';
import { DealStateView } from 'types';

const crmBoardSlice = createSlice({
  name: 'crmBoard',
  initialState: initialState.crmBoard,
  reducers: {
    dispatchFetchDealStates(state) {
      state.isFetchingStates = true;
    },
    dispatchFetchRemindersCount(state) {
      state.isFetchingRemindersCount = true;
    },
    setRemindersCount(state, action: PayloadAction<number>) {
      state.remindersCount = action.payload;
      state.isFetchingRemindersCount = false;
    },
    setDealStates(state, action: PayloadAction<DealStateView[]>) {
      state.states = orderBy(action.payload, ['orderId'], ['asc']);
      state.isFetchingStates = false;
    },
    setIsFetchingStates(state, action: PayloadAction<boolean>) {
      state.isFetchingStates = action.payload;
    },
    setIsFetchingRemindersCount(state, action: PayloadAction<boolean>) {
      state.isFetchingRemindersCount = action.payload;
    },
  },
});

export const {
  setDealStates,
  setIsFetchingStates,
  setRemindersCount,
  setIsFetchingRemindersCount,
  dispatchFetchDealStates,
  dispatchFetchRemindersCount,
} = crmBoardSlice.actions;

export default crmBoardSlice.reducer;
