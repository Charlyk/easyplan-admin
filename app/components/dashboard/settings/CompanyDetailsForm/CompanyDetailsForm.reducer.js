import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

export const initialState = {
  isSaving: false,
  isDeleting: false,
  showDeleteRequestSent: false,
  deleteModal: { open: false },
  timeZones: [],
  data: {
    id: '',
    logoUrl: null,
    logoFile: null,
    clinicName: '',
    email: '',
    website: '',
    phoneNumber: '',
    telegramNumber: '',
    viberNumber: '',
    whatsappNumber: '',
    description: '',
    socialNetworks: '',
    workdays: [],
    currency: 'MDL',
    allCurrencies: [],
    country: 'mda',
    timeZone: moment.tz.guess(true),
    isValidPhoneNumber: true,
    isValidViberNumber: true,
    isValidTelegramNumber: true,
    isValidWhatsappNumber: true,
    hasBrackets: false,
  },
};

const companyDetailsFormSlice = createSlice({
  name: 'companyDetailsForm',
  initialState,
  reducers: {
    setIsSaving(state, action) {
      state.isSaving = action.payload;
    },
    setIsDeleting(state, action) {
      state.isDeleting = action.payload;
    },
    openDeleteRequestSent(state) {
      state.showDeleteRequestSent = true;
      state.isDeleting = false;
      state.deleteModal = { open: false };
    },
    closeDeleteRequestSent(state) {
      state.showDeleteRequestSent = false;
    },
    openDeleteConfirmation(state) {
      state.deleteModal = { open: true };
      state.showDeleteRequestSent = false;
    },
    closeDeleteConfirmation(state) {
      state.deleteModal = { open: false };
    },
    setTimeZones(state, action) {
      state.timeZones = action.payload;
      state.isSaving = false;
    },
    setData(state, action) {
      state.data = action.payload;
    },
  },
});

export const {
  setIsSaving,
  setTimeZones,
  setData,
  setIsDeleting,
  closeDeleteConfirmation,
  closeDeleteRequestSent,
  openDeleteRequestSent,
  openDeleteConfirmation,
} = companyDetailsFormSlice.actions;

export default companyDetailsFormSlice.reducer;
