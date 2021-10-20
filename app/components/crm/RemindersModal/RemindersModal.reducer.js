import { createSlice } from "@reduxjs/toolkit";
import groupBy from 'lodash/groupBy';
import { textForKey } from "../../../utils/localization";
import moment from "moment-timezone";

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
  selectedFilter: filterOptions[0],
  isLoading: false,
  reminders: {},
}

const remindersModalSlice = createSlice({
  name: 'remindersModal',
  initialState,
  reducers: {
    setSelectedFilter(state, action) {
      state.selectedFilter = action.payload;
    },
    setReminders(state, action) {
      state.reminders = groupBy(action.payload, item => moment(item.dueDate).format('YYYY-MM-DD'));
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    resetState() {
      return initialState;
    }
  },
});

export const {
  setSelectedFilter,
  setReminders,
  setIsLoading,
  resetState,
} = remindersModalSlice.actions;

export default remindersModalSlice.reducer;
