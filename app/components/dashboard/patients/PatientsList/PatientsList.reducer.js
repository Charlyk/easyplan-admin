import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
  isUploading: false,
  showImportModal: false,
  showUploadModal: false,
  showDeleteDialog: false,
  patients: { data: [], total: 0 },
  rowsPerPage: 25,
  page: 0,
  showCreateModal: false,
  searchQuery: '',
  patientToDelete: null,
  isDeleting: false,
};

const patientsListSlice = createSlice({
  name: 'patientsList',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setIsUploading(state, action) {
      state.isUploading = action.payload;
    },
    setPatients(state, action) {
      state.patients = action.payload;
    },
    setRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setShowUploadModal(state, action) {
      state.showUploadModal = action.payload;
    },
    setShowCreateModal(state, action) {
      state.showCreateModal = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setShowDeleteDialog(state, action) {
      state.showDeleteDialog = action.payload;
    },
    setPatientToDelete(state, action) {
      state.patientToDelete = action.payload;
      state.showDeleteDialog = Boolean(action.payload);
      state.isDeleting = false;
    },
    setIsDeleting(state, action) {
      state.isDeleting = action.payload;
    },
    setInitialQuery(state, action) {
      const { page, rowsPerPage } = action.payload;
      state.page = page;
      state.rowsPerPage = rowsPerPage;
    },
    setShowImportModal(state, action) {
      state.showImportModal = action.payload;
      state.csvFile = null;
    },
  },
});

export const {
  setPatientToDelete,
  setIsLoading,
  setInitialQuery,
  setPatients,
  setIsDeleting,
  setPage,
  setRowsPerPage,
  setSearchQuery,
  setShowImportModal,
  setShowCreateModal,
} = patientsListSlice.actions;

export default patientsListSlice.reducer;
