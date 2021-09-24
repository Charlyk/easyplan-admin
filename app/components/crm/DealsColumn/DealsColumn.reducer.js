import { createSlice } from "@reduxjs/toolkit";
import orderBy from 'lodash/orderBy';
import { textForKey } from "../../../../utils/localization";

export const sheetActions = [
  {
    name: textForKey('Rename column'),
    key: 'renameColumn',
    icon: null,
    type: 'default'
  },
  {
    name: textForKey('Change column color'),
    key: 'changeColor',
    icon: null,
    type: 'default',
  },
  {
    name: textForKey('Move column to right'),
    key: 'moveToRight',
    icon: null,
    type: 'default',
  },
  {
    name: textForKey('Move column to left'),
    key: 'moveToLeft',
    icon: null,
    type: 'default',
  },
  {
    name: textForKey('Add new column'),
    key: 'addColumn',
    icon: null,
    type: 'default',
  },
  {
    name: textForKey('Delete column'),
    key: 'deleteColumn',
    icon: null,
    type: 'destructive',
  },
]

export const initialState = {
  isFetching: false,
  showActions: false,
  isEditingName: false,
  showColorPicker: false,
  showCreateColumn: false,
  columnName: '',
  columnColor: '',
  totalElements: 0,
  items: [],
  dealState: null,
};

const dealsColumnSlice = createSlice({
  name: 'dealsColumn',
  initialState,
  reducers: {
    setColumnData(state, action) {
      state.columnName = action.payload.name;
      state.columnColor = action.payload.color;
      state.dealState = action.payload;
    },
    setColumnName(state, action) {
      state.columnName = action.payload.toUpperCase();
    },
    setColumnColor(state, action) {
      state.columnColor = action.payload;
    },
    setShowActions(state, action) {
      state.showActions = action.payload;
    },
    setIsEditingName(state, action) {
      state.isEditingName = action.payload;
    },
    setShowColorPicker(state, action) {
      state.showColorPicker = action.payload;
      state.isEditingName = false;
      state.showActions = false;
    },
    setShowCreateColumn(state, action) {
      state.showCreateColumn = action.payload;
      state.showActions = false;
      state.isEditingName = false;
      state.showColorPicker = false;
    },
    setData(state, action) {
      state.totalElements = action.payload.total;
      state.items = action.payload.data;
      state.isFetching = false;
    },
    setIsFetching(state, action) {
      state.isFetching = action.payload;
    },
    setUpdatedDeal(state, action) {
      const newDeal = action.payload;
      const { state: itemState } = newDeal;
      const { dealState: columnState } = state;
      if (itemState.id !== columnState.id) {
        state.items = state.items.filter((item) => item.id !== newDeal.id);
      } else {
        const itemExists = state.items.some((item) => item.id === newDeal.id);
        if (itemExists) {
          state.items = state.items.map((item) => {
            if (item.id !== newDeal.id) {
              return item;
            }

            return newDeal;
          });
        } else {
          state.items = orderBy([...state.items, newDeal], ['created'], ['desc']);
        }
      }
      state.totalElements = state.items.length;
    }
  },
});

export const {
  setShowActions,
  setIsEditingName,
  setColumnName,
  setShowColorPicker,
  setColumnColor,
  setColumnData,
  setShowCreateColumn,
  setData,
  setIsFetching,
  setUpdatedDeal,
} = dealsColumnSlice.actions;

export default dealsColumnSlice.reducer;
