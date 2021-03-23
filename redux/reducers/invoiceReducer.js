import types from '../types/types';

const initialState = Object.freeze({
  updateInvoice: null,
  totalInvoices: 0,
});

export default function invoices(state = initialState, action) {
  switch (action.type) {
    case types.toggleUpdateInvoice:
      return { ...state, updateInvoice: action.payload };
    case types.setTotalInvoices:
      return { ...state, totalInvoices: action.payload };
    default:
      return state;
  }
}
