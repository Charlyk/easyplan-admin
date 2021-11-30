import types from '../types';

/**
 * Toggle add payment modal
 * @param {{ open: boolean, patient: Object|null}} payload
 * @return {{payload, type: string}}
 */
export function setAddPaymentModal(payload) {
  return {
    type: types.setAddPaymentModal,
    payload,
  };
}
