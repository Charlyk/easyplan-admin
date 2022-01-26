import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import { HYDRATE } from 'next-redux-wrapper';
import initialState from 'redux/initialState';
import { DealStateView } from 'types';

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
    setRemindersCount(state, action: PayloadAction<number>) {
      state.remindersCount = action.payload;
      state.isFetchingRemindersCount = false;
    },
    setDealStates(state, action: PayloadAction<DealStateView[]>) {
      state.states = orderBy(action.payload, ['orderId'], ['asc']);
      state.isFetchingStates = false;
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
  setDealStates,
  setUserDealStates,
  setIsFetchingStates,
  setRemindersCount,
  setIsFetchingRemindersCount,
  dispatchFetchDealStates,
  dispatchFetchRemindersCount,
} = crmBoardSlice.actions;

export default crmBoardSlice.reducer;
