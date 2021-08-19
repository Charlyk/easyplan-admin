import { createSlice } from "@reduxjs/toolkit";
import { availableHours } from "../CreateMessageDialog.constants";
import moment from "moment-timezone";

export const initialState = {
  isLoading: false,
  language: 'ro',
  message: { ro: '', en: '', ru: '' },
  messageTitle: '',
  messageDate: new Date(),
  showDatePicker: false,
  hourToSend: availableHours[0],
  maxLength: 160,
  recipientsCount: -1,
  filterData: {
    statuses: [],
    categories: [],
    services: [],
    range: [],
  },
};

const promotionalMessageSlice = createSlice({
  name: 'promotionalMessageForm',
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
    setMessageDate(state, action) {
      state.messageDate = action.payload;
      state.showDatePicker = false;
    },
    setShowDatePicker(state, action) {
      state.showDatePicker = action.payload;
    },
    setFilterData(state, action) {
      state.filterData = action.payload;
    },
    setMessageData(state, action) {
      const message = action.payload;
      state.messageTitle = message.messageTitle;
      state.message = JSON.parse(message.messageText);
      state.hourToSend = message.hourToSendAt;
      state.messageDate = moment(message.dateToSend).toDate();
    },
    setRecipientsCount(state, action) {
      state.recipientsCount = action.payload;
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
  setMessageDate,
  setShowDatePicker,
  setFilterData,
  setRecipientsCount,
} = promotionalMessageSlice.actions;

export default promotionalMessageSlice.reducer;

