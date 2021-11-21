import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { textForKey } from 'app/utils/localization';

const tomorrow = moment().add(1, 'day');

export const reminderTypes = [
  {
    id: 'Contact',
    name: textForKey('crm_reminder_type_contact'),
  },
  {
    id: 'Meeting',
    name: textForKey('crm_reminder_type_meeting'),
  },
];

export const initialState = {
  startTime: tomorrow.format('HH:mm'),
  endTime: tomorrow.add(15, 'minutes').format('HH:mm'),
  patient: null,
  date: tomorrow.toDate(),
  user: null,
  type: reminderTypes[0],
  note: '',
  isLoading: false,
};

const addReminderModalSlice = createSlice({
  name: 'addReminderModal',
  initialState,
  reducers: {
    setStartTime(state, action) {
      state.startTime = action.payload;
    },
    setEndTime(state, action) {
      state.endTime = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setType(state, action) {
      state.type = action.payload;
    },
    setNote(state, action) {
      state.note = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setPatient(state, action) {
      state.patient = action.payload;
    },
    resetState(state) {
      return { ...initialState, user: state.user };
    },
  },
});

export const {
  setType,
  setUser,
  setNote,
  setEndTime,
  setStartTime,
  setDate,
  resetState,
  setIsLoading,
  setPatient,
} = addReminderModalSlice.actions;

export default addReminderModalSlice.reducer;
