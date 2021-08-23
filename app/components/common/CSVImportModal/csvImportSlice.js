import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  data: [],
  file: null,
  mappedFields: [],
}

const csvImportSlice = createSlice({
  name: 'csvImport',
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload.data;
      state.file = action.payload.file;
    },
    setFile(state, action) {
      state.file = action.payload;
    },
    setMappedFields(state, action) {
      state.mappedFields = action.payload
    },
    resetState(state) {
      state.data = [];
      state.mappedFields = [];
      state.file = null;
    }
  },
});

export const {
  setData,
  resetState,
  setMappedFields,
} = csvImportSlice.actions;

export default csvImportSlice.reducer;
