import types from '../types/types';

export function toggleUpdateInvoice(payload) {
  return {
    type: types.toggleUpdateInvoice,
    payload,
  };
}
