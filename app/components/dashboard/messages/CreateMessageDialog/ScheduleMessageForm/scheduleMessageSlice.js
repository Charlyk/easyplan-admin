import { createSlice } from '@reduxjs/toolkit';
import { availableHours } from '../CreateMessageDialog.constants';

export const initialState = {
  isLoading: false,
  language: 'ro',
  message: { ro: '', en: '', ru: '' },
  messageTitle: '',
  hourToSend: availableHours[0],
  maxLength: 160,
};

const scheduleMessageSlice = createSlice({
  name: 'scheduleMessageForm',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setMessage(state, action) {
      state.message = { ...state.message, ...action.payload };
    },
    setMessageTitle(state, action) {
      state.messageTitle = action.payload;
    },
    setHourToSend(state, action) {
      state.hourToSend = action.payload;
    },
    setMaxLength(state, action) {
      state.maxLength = action.payload;
    },
    setMessageData(state, action) {
      const message = action.payload;
      state.messageTitle = message.messageTitle;
      state.message = JSON.parse(message.messageText);
      state.hourToSend = message.hourToSendAt;
    },
  },
});

export const {
  setLanguage,
  setMessage,
  setIsLoading,
  setMessageTitle,
  setHourToSend,
  setMaxLength,
  setMessageData,
} = scheduleMessageSlice.actions;

export default scheduleMessageSlice.reducer;
