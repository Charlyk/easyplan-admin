import types from 'redux/types';

/**
 * Toggle image modal
 * @param {Object} payload
 * @param {boolean} payload.open
 * @param {string?} payload.imageUrl
 * @return {{payload: *, type: string}}
 */
export function setImageModal(payload) {
  return {
    type: types.setImageModal,
    payload,
  };
}
