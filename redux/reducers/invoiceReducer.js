import types from 'redux/types';

const initialState = Object.freeze({
  updateInvoice: null,
  totalInvoices: 0,
});

export default function invoices(state = initialState, { type, payload } = {}) {
  switch (type) {
    case types.toggleUpdateInvoice:
      return { ...state, updateInvoice: payload };
    case types.setTotalInvoices:
      return { ...state, totalInvoices: payload };
    default:
      return state;
  }
}
