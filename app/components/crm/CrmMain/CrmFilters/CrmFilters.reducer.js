import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { textForKey } from 'app/utils/localization';

export const Shortcuts = [
  {
    id: 0,
    type: 'default',
    name: textForKey('crm_filter_all_deals'),
  },
  {
    id: 1,
    type: 'default',
    name: textForKey('crm_filter_opened_deals'),
  },
  {
    id: 2,
    type: 'default',
    name: textForKey('crm_filter_my_deals'),
  },
  {
    id: 3,
    type: 'default',
    name: textForKey('crm_filter_closed_successfully'),
  },
  {
    id: 4,
    type: 'default',
    name: textForKey('crm_filter_not_realized'),
  },
  {
    id: 5,
    type: 'reminder',
    name: textForKey('crm_filter_shortcuts_today_reminders'),
  },
  {
    id: 6,
    type: 'reminder',
    name: textForKey('crm_filter_shortcuts_expired_tasks'),
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
    name: textForKey('crm_filter_expired_tasks'),
  },
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
  selectedShortcut: Shortcuts[0],
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
    setSelectedShortcut(state, action) {
      state.selectedShortcut = action.payload;
    },
    resetState() {
      return initialState;
    },
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
  setSelectedShortcut,
  resetState,
} = crmFiltersSlice.actions;

export default crmFiltersSlice.reducer;
