import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  data: [],
  file: null,
  mappedFields: [],
  snackbar: { show: false, message: '' },
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
      state.data = initialState.data;
      state.mappedFields = initialState.mappedFields;
      state.file = initialState.file;
      state.snackbar = initialState.snackbar
    },
    setSnackbar(state, action) {
      state.snackbar = action.payload
    }
  },
});

export const {
  setData,
  resetState,
  setMappedFields,
  setSnackbar,
} = csvImportSlice.actions;

export default csvImportSlice.reducer;
