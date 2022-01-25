import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateReminderRequest } from '../../types/api';
import { ReminderType } from '../../types/reminder.types';
import initialState from '../initialState';

type OpenAction = {
  deal: { id: number };
  searchType: 'Deal' | 'Schedule';
};

const createReminderModalSlice = createSlice({
  name: 'createReminderModal',
  initialState: initialState.createReminderModal,
  reducers: {
    dispatchCreateNewReminder(
      state,
      _action: PayloadAction<CreateReminderRequest>,
    ) {
      state.isLoading = true;
    },
    setNewReminder(state, _action: PayloadAction<ReminderType>) {
      state.isLoading = false;
      state.open = false;
      state.deal = null;
      state.searchType = 'Deal';
    },
    openCreateReminderModal(state, action: PayloadAction<OpenAction>) {
      state.open = true;
      state.deal = action.payload.deal;
      state.searchType = action.payload.searchType;
    },
    closeCreateReminderModal(state) {
      state.open = false;
      state.deal = null;
      state.searchType = initialState.createReminderModal.searchType;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  dispatchCreateNewReminder,
  setNewReminder,
  openCreateReminderModal,
  closeCreateReminderModal,
  setIsLoading,
} = createReminderModalSlice.actions;

export default createReminderModalSlice.reducer;
