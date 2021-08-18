import { createSlice } from "@reduxjs/toolkit";
import { availableHours, messageTypeEnum } from "./CreateMessageDialog.constants";

export const initialState = {
  isLoading: false,
  selectedMenu: messageTypeEnum.ScheduleNotification,
  currentLanguage: 'ro',
  maxLength: 160,
  message: {
    message: { ro: '', en: '', ru: '' },
    messageTitle: '',
    messageType: messageTypeEnum.ScheduleNotification,
    hourToSend: availableHours[0],
    messageDate: new Date(),
    filter: {
      statuses: [],
      categories: [],
      services: [],
      range: [],
    },
  },
};

const createMessageDialogSlice = createSlice({
  name: 'createMessageDialog',
  initialState,
  reducers: {
    setSelectedMenu(state, action) {
      state.selectedMenu = action.payload;
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    setCurrentLanguage(state, action) {
      state.currentLanguage = action.payload;
    },
    setMaxLength(state, action) {
      state.maxLength = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSelectedMenu,
  setMessage,
  setCurrentLanguage,
  setMaxLength,
  setIsLoading,
} = createMessageDialogSlice.actions;

export default createMessageDialogSlice.reducer;
