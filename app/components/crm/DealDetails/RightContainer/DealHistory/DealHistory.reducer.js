import { createSlice } from "@reduxjs/toolkit";
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import moment from "moment-timezone";

export const initialState = {
  isFetching: false,
  items: [],
  reminders: [],
}

export const ItemType = {
  message: 'Message',
  note: 'Note',
  reminder: 'Reminder',
};

const dealHistorySlice = createSlice({
  name: 'dealHistory',
  initialState,
  reducers: {
    setHistory(state, action) {
      const { messages, notes, reminders } = action.payload;
      state.reminders = reminders;
      const newItems = orderBy(
        [
          ...messages.map(item => ({ ...item, itemType: ItemType.message })),
          ...notes.map(item => ({ ...item, itemType: ItemType.note })),
          ...reminders.map(item => ({ ...item, itemType: ItemType.reminder })),
        ],
        ['created'],
        ['desc'],
      );
      const groupedItems = groupBy(newItems, item => moment(item.created).format('YYYY-MM-DD'));
      console.log(groupedItems);
      state.items = groupedItems;
    },
    setIsFetching(state, action) {
      state.isFetching = action.payload;
    }
  },
});

export const {
  setHistory,
  setIsFetching,
} = dealHistorySlice.actions;

export default dealHistorySlice.reducer;
