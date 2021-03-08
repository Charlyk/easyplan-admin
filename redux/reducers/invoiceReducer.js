import types from '../types/types';

const initialState = Object.freeze({
  updateInvoice: null,
});

export default function invoices(state = initialState, action) {
  switch (action.type) {
    case types.toggleUpdateInvoice:
      return { ...state, updateInvoice: action.payload };
    default:
      return state;
  }
}
