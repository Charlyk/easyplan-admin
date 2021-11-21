import { createSlice } from '@reduxjs/toolkit';
import groupBy from 'lodash/groupBy';
import moment from 'moment-timezone';

import { textForKey } from '../../../utils/localization';

export const filterOptions = [
  {
    id: 0,
    name: textForKey('crm_reminders_my_tasks'),
  },
  {
    id: 1,
    name: textForKey('crm_reminders_expired_tasks'),
  },
  {
    id: 2,
    name: textForKey('crm_reminders_completed_tasks'),
  },
  {
    id: 3,
    name: textForKey('crm_reminders_all_tasks'),
  },
];

export const initialState = {
  filters: {
    shortcut: filterOptions[0],
    dateRange: null,
  },
  isLoading: false,
  reminders: {},
  showDateRange: false,
};

const remindersModalSlice = createSlice({
  name: 'remindersModal',
  initialState,
  reducers: {
    setFilterShortcut(state, action) {
      state.filters = { ...state.filters, shortcut: action.payload };
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setReminders(state, action) {
      state.reminders = groupBy(action.payload, (item) =>
        moment(item.dueDate).format('YYYY-MM-DD'),
      );
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setShowDateRangePicker(state, action) {
      state.showDateRange = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export const {
  setFilters,
  setReminders,
  setIsLoading,
  resetState,
  setFilterShortcut,
  setShowDateRangePicker,
} = remindersModalSlice.actions;

export default remindersModalSlice.reducer;
