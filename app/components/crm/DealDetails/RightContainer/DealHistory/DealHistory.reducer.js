import { createSlice } from "@reduxjs/toolkit";
import groupBy from 'lodash/groupBy';
import moment from "moment-timezone";

export const initialState = {
  isFetching: false,
  items: {},
  allData: [],
  reminders: [],
}

export const ItemType = {
  message: 'Message',
  note: 'Note',
  reminder: 'Reminder',
  log: 'Log',
  sms: 'Sms Message',
  phoneCall: 'Phone call',
};

const dealHistorySlice = createSlice({
  name: 'dealHistory',
  initialState,
  reducers: {
    setHistory(state, action) {
      const { messages, notes, reminders, logs, smsMessages, phoneCalls } = action.payload;
      state.reminders = reminders;
      const filteredReminders = reminders.filter((item) => {
        return item.active || item.completed;
      })
      const newItems = [
        ...messages.map(item => ({ ...item, itemType: ItemType.message })),
        ...notes.map(item => ({ ...item, itemType: ItemType.note })),
        ...logs.map(item => ({ ...item, itemType: ItemType.log })),
        ...smsMessages.map(item => ({ ...item, itemType: ItemType.sms })),
        ...phoneCalls.map(item => ({ ...item, itemType: ItemType.phoneCall })),
        ...filteredReminders.map(item => ({
          ...item,
          itemType: ItemType.reminder,
        })),
      ];
      state.allData = newItems;
      state.items = groupBy(newItems, item => moment(item.created).format('YYYY-MM-DD'));
    },
    setIsFetching(state, action) {
      state.isFetching = action.payload;
    },
    setUpdatedReminder(state, action) {
      const { reminder: newReminder, dealId } = action.payload;

      const reminderExists = state.allData.some(item => item.id === newReminder.id);
      if (reminderExists) {
        state.allData = state.allData.map((item) => {
          if (item.id !== newReminder.id) {
            return item;
          }
          return {
            ...newReminder,
            itemType: ItemType.reminder
          };
        });
      } else if (newReminder.deal.id === dealId && (newReminder.active || newReminder.completed)) {
        state.allData = [...state.allData, newReminder]
      }
      state.items = groupBy(state.allData, item => moment(item.created).format('YYYY-MM-DD'));
    },
  },
});

export const {
  setHistory,
  setIsFetching,
  setUpdatedReminder,
} = dealHistorySlice.actions;

export default dealHistorySlice.reducer;
