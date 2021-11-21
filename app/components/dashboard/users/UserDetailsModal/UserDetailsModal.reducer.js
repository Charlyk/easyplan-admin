import { createSlice } from '@reduxjs/toolkit';

import { Role } from '../../../../utils/constants';

export const initialData = {
  services: [],
  workdays: [
    {
      day: 2,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 3,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 4,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 5,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 6,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 7,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 1,
      startHour: null,
      endHour: null,
      selected: false,
    },
  ],
  holidays: [],
  braces: [],
  userType: Role.doctor,
};

export const initialState = {
  currentTab: Role.doctor,
  isSaving: false,
  isLoading: true,
  userData: initialData,
  isCreatingHoliday: {
    open: false,
    holiday: null,
  },
};

const userDetailsModalSlice = createSlice({
  name: 'userDetailsModal',
  initialState,
  reducers: {
    setCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
    setIsSaving(state, action) {
      state.isSaving = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setIsCreatingHoliday(state, action) {
      state.isCreatingHoliday = action.payload;
    },
    setUserType(state, action) {
      state.userData = { ...state.userData, userType: action.payload };
    },
    setUserHolidays(state, action) {
      state.userData = { ...state.userData, holidays: action.payload };
    },
    resetState() {
      return initialState;
    },
  },
});

export const {
  setIsCreatingHoliday,
  setIsSaving,
  setUserData,
  setUserHolidays,
  setUserType,
  setIsLoading,
  resetState,
} = userDetailsModalSlice.actions;

export default userDetailsModalSlice.reducer;
