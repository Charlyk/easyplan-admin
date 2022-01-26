import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { textForKey } from 'app/utils/localization';
import { DealShortcutType, ReminderType } from 'types';

export const Shortcuts = [
  {
    id: DealShortcutType.All,
    type: 'default',
    name: textForKey('crm_filter_all_deals'),
  },
  {
    id: DealShortcutType.Opened,
    type: 'default',
    name: textForKey('crm_filter_opened_deals'),
  },
  {
    id: DealShortcutType.Mine,
    type: 'default',
    name: textForKey('crm_filter_my_deals'),
  },
  {
    id: DealShortcutType.Success,
    type: 'default',
    name: textForKey('crm_filter_closed_successfully'),
  },
  {
    id: DealShortcutType.Closed,
    type: 'default',
    name: textForKey('crm_filter_not_realized'),
  },
  {
    id: DealShortcutType.TodayTasks,
    type: 'reminder',
    name: textForKey('crm_filter_shortcuts_today_reminders'),
  },
  {
    id: DealShortcutType.ExpiredTasks,
    type: 'reminder',
    name: textForKey('crm_filter_shortcuts_expired_tasks'),
  },
];

export const reminderOptions = [
  {
    id: ReminderType.All,
    name: textForKey('crm_filter_all_reminders'),
  },
  {
    id: ReminderType.Today,
    name: textForKey('crm_filter_today_reminders'),
  },
  {
    id: ReminderType.Tomorrow,
    name: textForKey('crm_filter_tomorrow_reminders'),
  },
  {
    id: ReminderType.Week,
    name: textForKey('crm_filter_current_week_reminders'),
  },
  {
    id: ReminderType.NoTasks,
    name: textForKey('crm_filter_without_tasks'),
  },
  {
    id: ReminderType.Expired,
    name: textForKey('crm_filter_expired_tasks'),
  },
];

export const initialState = {
  loading: { patients: false, filter: false },
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
    dispatchFetchCrmFilter(state) {
      state.loading = { ...state.loading, filter: true };
    },
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
  dispatchFetchCrmFilter,
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
