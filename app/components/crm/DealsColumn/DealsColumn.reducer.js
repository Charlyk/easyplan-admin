import { createSlice } from "@reduxjs/toolkit";
import orderBy from 'lodash/orderBy';
import { textForKey } from "../../../utils/localization";

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

export const STATUS_LOADING = 1;
export const STATUS_LOADED = 2;

export const initialState = {
  isFetching: false,
  showActions: false,
  isEditingName: false,
  showColorPicker: false,
  showCreateColumn: false,
  columnName: '',
  columnColor: '',
  totalElements: 0,
  page: 0,
  itemsPerPage: 25,
  items: [],
  dealState: null,
  loadedRowsMap: {},
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
      const currentItems = state.items;
      for (let item of action.payload.data) {
        if (!currentItems.some(deal => deal.id === item.id)) {
          currentItems.push(item);
        }
      }
      state.items = currentItems;
      state.isFetching = false;
      state.page = state.page + 1
    },
    setIsFetching(state, action) {
      state.isFetching = action.payload;
    },
    addNewDeal(state, action) {
      const dealExists = state.items.some(item => item.id === action.payload.id);
      if (!dealExists) {
        state.items = orderBy([...state.items, action.payload], ['created'], ['desc']);
        state.totalElements = state.items.length;
      }
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
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setItemsPerPage(state, action) {
      state.itemsPerPage = action.payload;
    },
    setIsRowLoading(state, action) {
      const { row, state: loadingState } = action.payload;
      state.loadedRowsMap = { ...state.loadedRowsMap, [row]: loadingState };
    },
    setRowsLoading(state, action) {
      const { rows, state: loadingState} = action.payload;
      const newState = {}
      for (let row of rows) {
        newState[row] = loadingState;
      }
      state.loadedRowsMap = { ...state.loadedRowsMap, ...newState };
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
  addNewDeal,
  setPage,
  setIsRowLoading,
  setRowsLoading,
} = dealsColumnSlice.actions;

export default dealsColumnSlice.reducer;
