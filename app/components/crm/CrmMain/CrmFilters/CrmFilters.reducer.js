import { createSlice } from "@reduxjs/toolkit";
import { textForKey } from "../../../../utils/localization";
import moment from "moment-timezone";

export const Shortcuts = [
  {
    id: 'all',
    name: textForKey('crm_filter_all_deals'),
  },
  {
    id: 'opened',
    name: textForKey('crm_filter_opened_deals'),
  },
  {
    id: 'myDeals',
    name: textForKey('crm_filter_my_deals'),
  },
  {
    id: 'success',
    name: textForKey('crm_filter_closed_successfully'),
  },
  {
    id: 'notRealized',
    name: textForKey('crm_filter_not_realized'),
  },
  {
    id: 'withoutReminders',
    name: textForKey('crm_filter_without_tasks'),
  },
  {
    id: 'expiredReminders',
    name: textForKey('crm_filter_expired_tasks'),
  },
];

export const reminderOptions = [
  {
    id: 0,
    name: textForKey('crm_filter_all_reminders'),
  },
  {
    id: 1,
    name: textForKey('crm_filter_today_reminders'),
  },
  {
    id: 2,
    name: textForKey('crm_filter_tomorrow_reminders'),
  },
  {
    id: 3,
    name: textForKey('crm_filter_current_week_reminders'),
  },
  {
    id: 4,
    name: textForKey('crm_filter_without_tasks'),
  },
  {
    id: 5,
    name: textForKey('crm_filter_expired_tasks')
  }
];

export const initialState = {
  loading: { patients: false },
  patient: null,
  selectedDoctors: [{ id: -1, name: textForKey('All doctors') }],
  selectedServices: [{ id: -1, name: textForKey('All services') }],
  selectedUsers: [{ id: -1, name: textForKey('All users') }],
  selectedStates: [{ id: -1, name: textForKey('All states') }],
  selectedDateRange: [],
  selectedReminder: null,
  showRangePicker: false,
};

export const defaultRange = [
  moment().toDate(),
  moment().add(10, 'days').toDate(),
];

const crmFiltersSlice = createSlice({
  name: 'crmFilters',
  initialState,
  reducers: {
    setPatient(state, action) {
      state.patient = action.payload;
    },
    setPatientsLoading(state, action) {
      state.loading = { ...state.loading, patients: action.payload };
    },
    setSelectedDoctors(state, action) {
      state.selectedDoctors = action.payload;
    },
    setSelectedReminder(state, action) {
      state.selectedReminder = action.payload;
    },
    setSelectedServices(state, action) {
      state.selectedServices = action.payload;
    },
    setSelectedUsers(state, action) {
      state.selectedUsers = action.payload;
    },
    setDateRange(state, action) {
      state.selectedDateRange = action.payload;
    },
    setShowRangePicker(state, action) {
      state.showRangePicker = action.payload;
    },
    setSelectedStates(state, action) {
      state.selectedStates = action.payload;
    },
    resetState() {
      return initialState;
    }
  },
});

export const {
  setPatient,
  setPatientsLoading,
  setSelectedDoctors,
  setSelectedReminder,
  setSelectedServices,
  setSelectedUsers,
  setDateRange,
  setShowRangePicker,
  setSelectedStates,
  resetState
} = crmFiltersSlice.actions;

export default crmFiltersSlice.reducer;
