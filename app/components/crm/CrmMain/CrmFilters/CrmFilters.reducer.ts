import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { default as reduxState } from 'redux/initialState';
import {
  CrmFilterOption,
  CrmFilterPatient,
  CrmFilterShortcut,
  CrmFilterType,
} from 'types';
import { SaveCrmFilterRequest } from 'types/api';
import {
  defaultRange,
  reminderOptions,
  Shortcuts,
} from './CrmFilters.constants';

export const initialState = reduxState.crmFilters;

const crmFiltersSlice = createSlice({
  name: 'crmFilters',
  initialState,
  reducers: {
    dispatchFetchCrmFilter(state) {
      state.loading = { ...state.loading, filter: true };
    },
    dispatchUpdateCrmFilter(
      state,
      _action: PayloadAction<SaveCrmFilterRequest>,
    ) {
      state.loading = { ...state.loading, filter: true };
    },
    setCrmFilter(state, action: PayloadAction<CrmFilterType>) {
      const filter = action.payload;
      state.loading = { ...state.loading, filter: false };
      state.selectedStates = filter.visibleStates.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      state.selectedReminder = reminderOptions.find(
        (option) => option.id === filter.reminderType,
      );
      state.selectedShortcut = Shortcuts.find(
        (item) => item.id === filter.shortcut,
      );
      state.patient = filter.patient;
      const startDate = filter.startDate
        ? moment(filter.startDate).toDate()
        : null;
      const endDate = filter.endDate ? moment(filter.endDate).toDate() : null;
      state.selectedDateRange =
        startDate && endDate ? [startDate, endDate] : [];
      state.selectedUsers =
        filter.responsible.length > 0
          ? filter.responsible.map((item) => ({
              id: item.id,
              name: `${item.firstName} ${item.lastName}`,
            }))
          : initialState.selectedUsers;
      state.selectedDoctors =
        filter.doctors.length > 0
          ? filter.doctors.map((item) => ({
              id: item.id,
              name: `${item.firstName} ${item.lastName}`,
            }))
          : initialState.selectedDoctors;
    },
    setFilterLoading(state, action: PayloadAction<boolean>) {
      state.loading = { ...state.loading, filter: action.payload };
    },
    setPatient(state, action: PayloadAction<CrmFilterPatient | null>) {
      state.patient = action.payload;
    },
    setPatientsLoading(state, action: PayloadAction<boolean>) {
      state.loading = { ...state.loading, patients: action.payload };
    },
    setSelectedDoctors(state, action: PayloadAction<CrmFilterOption[] | null>) {
      state.selectedDoctors = action.payload ?? [];
    },
    setSelectedReminder(state, action: PayloadAction<CrmFilterOption | null>) {
      state.selectedReminder = action.payload;
    },
    setSelectedServices(
      state,
      action: PayloadAction<CrmFilterOption[] | null>,
    ) {
      state.selectedServices = action.payload ?? [];
    },
    setSelectedUsers(state, action: PayloadAction<CrmFilterOption[] | null>) {
      state.selectedUsers = action.payload ?? [];
    },
    setDateRange(state, action: PayloadAction<[Date, Date] | []>) {
      state.selectedDateRange = action.payload;
    },
    setShowRangePicker(state, action: PayloadAction<boolean>) {
      state.showRangePicker = action.payload;
    },
    setSelectedStates(state, action: PayloadAction<CrmFilterOption[] | null>) {
      state.selectedStates = action.payload ?? [];
    },
    setSelectedShortcut(
      state,
      action: PayloadAction<CrmFilterShortcut | null>,
    ) {
      state.selectedShortcut = action.payload;
    },
    resetState(state, action: PayloadAction<CrmFilterOption[]>) {
      state.selectedStates = action.payload;
      state.selectedDoctors = initialState.selectedDoctors;
      state.selectedShortcut = initialState.selectedShortcut;
      state.selectedUsers = initialState.selectedUsers;
      state.selectedReminder = initialState.selectedReminder;
      state.selectedDateRange = initialState.selectedDateRange;
      state.selectedServices = initialState.selectedServices;
    },
  },
});

export const {
  dispatchFetchCrmFilter,
  dispatchUpdateCrmFilter,
  setCrmFilter,
  setFilterLoading,
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
