import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { ShortInvoice } from 'types';

const invoicesButtonSlice = createSlice({
  name: 'invoicesButton',
  initialState: initialState.invoicesButton,
  reducers: {
    fetchInvoicesList(state) {
      state.isLoading = true;
    },
    addInvoice(state, action: PayloadAction<ShortInvoice>) {
      const invoiceExists = state.invoices.some(
        (item) => item.id === action.payload.id,
      );
      if (!invoiceExists) {
        state.invoices = [action.payload, ...state.invoices];
      }
    },
    updateInvoice(state, action: PayloadAction<ShortInvoice>) {
      state.invoices = state.invoices.map((item) => {
        if (item.id !== action.payload.id) {
          return item;
        }
        return {
          ...item,
          ...action.payload,
        };
      });
    },
    removeInvoice(state, action: PayloadAction<{ id: number }>) {
      state.invoices = state.invoices.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    setInvoicesList(state, action: PayloadAction<ShortInvoice[]>) {
      state.invoices = action.payload;
      state.isLoading = false;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  fetchInvoicesList,
  setIsLoading,
  setInvoicesList,
  addInvoice,
  removeInvoice,
  updateInvoice,
} = invoicesButtonSlice.actions;

export default invoicesButtonSlice.reducer;
