import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  columns: [],
  linkModal: { open: false, deal: null },
  deleteModal: { open: false, deal: null },
  detailsModal: { open: false, deal: null },
  updatedDeal: null,
};

const crmMainSlice = createSlice({
  name: 'crmMain',
  initialState,
  reducers: {
    setColumns(state, action) {
      console.log(action.payload)
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
      const { deal, confirm } = action.payload;
      state.linkModal = { open: true, deal: deal, confirmContact: confirm };
    },
    closeLinkModal(state) {
      state.linkModal = { open: false, deal: null, confirmContact: false };
    },
    setUpdatedDeal(state, action) {
      if (action.payload.id === state.detailsModal.deal?.id) {
        state.detailsModal = { ...state.detailsModal, deal: action.payload };
      }
      state.updatedDeal = action.payload;
    },
    openDetailsModal(state, action) {
      state.detailsModal = { open: true, deal: action.payload };
    },
    closeDealDetails(state) {
      state.detailsModal = { open: false, deal: null };
    }
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
  openDetailsModal,
  closeDealDetails,
} = crmMainSlice.actions;

export default crmMainSlice.reducer;
