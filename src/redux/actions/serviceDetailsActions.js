import types from '../types/types';

/**
 * Toggle service modal
 * @param {Object} payload
 * @param {boolean} payload.open
 * @param {Object?} payload.service
 * @param {Object?} payload.category
 * @return {{payload: *, type: string}}
 */
export function setServiceDetailsModal(payload) {
  return {
    type: types.setServiceModal,
    payload,
  };
}
