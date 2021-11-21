import { createSlice } from '@reduxjs/toolkit';

export const categoryModalState = {
  closed: 'closed',
  edit: 'edit',
  create: 'create',
};

export const initialState = {
  categories: [],
  isLoading: false,
  category: { data: null, index: -1 },
  deleteServiceModal: { open: false, service: null, isLoading: false },
  categoryModal: { state: categoryModalState.closed },
  showUploadModal: false,
  isUploading: false,
  setupExcelModal: { open: false, data: null },
  clinicServices: [],
  showImportModal: false,
};

const servicesContainerSlice = createSlice({
  name: 'servicesContainer',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setDeleteServiceModal(state, action) {
      state.deleteServiceModal = action.payload;
    },
    setCategoryModal(state, action) {
      state.categoryModal = action.payload;
    },
    setShowUploadModal(state, action) {
      state.showUploadModal = action.payload;
    },
    setIsUploading(state, action) {
      state.isUploading = action.payload;
    },
    setSetupExcelModal(state, action) {
      state.setupExcelModal = action.payload;
    },
    setClinicServices(state, action) {
      state.clinicServices = action.payload;
    },
    setShowImportModal(state, action) {
      state.showImportModal = action.payload;
    },
  },
});

export const {
  setIsUploading,
  setCategories,
  setCategoryModal,
  setSetupExcelModal,
  setCategory,
  setDeleteServiceModal,
  setIsLoading,
  setShowImportModal,
  setClinicServices,
} = servicesContainerSlice.actions;

export default servicesContainerSlice.reducer;
