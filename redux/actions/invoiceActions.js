import types from '../types';

export function toggleUpdateInvoice(payload) {
  return {
    type: types.toggleUpdateInvoice,
    payload,
  };
}

export function setTotalInvoices(total) {
  return {
    type: types.setTotalInvoices,
    payload: total,
  };
}
