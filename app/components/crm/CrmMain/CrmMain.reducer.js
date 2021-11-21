import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  columns: [],
  linkModal: { open: false, deal: null },
  deleteModal: { open: false, deal: null, isLoading: false },
  detailsModal: { open: false, deal: null },
  reminderModal: { open: false, deal: null },
  updatedDeal: null,
  showFilters: false,
  showReminders: false,
  activeRemindersCount: 0,
  queryParams: {},
  callToPlay: null,
  showPageConnectModal: false,
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
      state.deleteModal = {
        open: true,
        deal: action.payload,
        isLoading: false,
      };
    },
    closeDeleteModal(state) {
      state.deleteModal = { open: false, deal: null, isLoading: false };
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
    },
    openReminderModal(state, action) {
      state.reminderModal = { open: true, deal: action.payload };
    },
    closeReminderModal(state) {
      state.reminderModal = { open: false, deal: null };
    },
    setIsDeleting(state, action) {
      state.deleteModal = { ...state.deleteModal, isLoading: action.payload };
    },
    setShowFilters(state, action) {
      state.showFilters = action.payload;
    },
    setQueryParams(state, action) {
      state.queryParams = action.payload;
    },
    setShowReminders(state, action) {
      state.showFilters = false;
      state.showReminders = action.payload;
    },
    setActiveRemindersCount(state, action) {
      state.activeRemindersCount = action.payload;
    },
    setCallToPlay(state, action) {
      state.callToPlay = action.payload;
    },
    setShowPageConnectModal(state, action) {
      state.showPageConnectModal = action.payload;
    },
  },
});

export const {
  setColumns,
  openDeleteModal,
  closeDeleteModal,
  openLinkModal,
  closeLinkModal,
  setUpdatedDeal,
  openDetailsModal,
  closeDealDetails,
  openReminderModal,
  closeReminderModal,
  setIsDeleting,
  setShowFilters,
  setQueryParams,
  setShowReminders,
  setActiveRemindersCount,
  setCallToPlay,
  setShowPageConnectModal,
} = crmMainSlice.actions;

export default crmMainSlice.reducer;
