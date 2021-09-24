import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  columns: [],
  linkModal: { open: false, deal: null },
  deleteModal: { open: false, deal: null },
  updatedDeal: null,
};

const crmMainSlice = createSlice({
  name: 'crmMain',
  initialState,
  reducers: {
    setColumns(state, action) {
      state.columns = action.payload;
    },
    setLinkModal(state, action) {
      state.linkModal = action.payload;
    },
    openDeleteModal(state, action) {
      state.deleteModal = { open: true, deal: action.payload };
    },
    closeDeleteModal(state) {
      state.deleteModal = { open: false, deal: null };
    },
    openLinkModal(state, action) {
      state.linkModal = { open: true, deal: action.payload };
    },
    closeLinkModal(state) {
      state.linkModal = { open: false, deal: null };
    },
    setUpdatedDeal(state, action) {
      state.updatedDeal = action.payload;
    },
  },
});

export const {
  setColumns,
  setLinkModal,
  openDeleteModal,
  closeDeleteModal,
  openLinkModal,
  closeLinkModal,
  setUpdatedDeal,
} = crmMainSlice.actions;

export default crmMainSlice.reducer;
