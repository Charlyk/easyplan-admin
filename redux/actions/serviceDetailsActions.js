import types from 'redux/types';

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

export function closeServiceDetailsModal(close) {
  return {
    type: types.closeServiceDetailsModal,
    payload: close,
  };
}

export function setServiceModalService(service) {
  return {
    type: types.setServiceModalService,
    payload: service,
  };
}

export function setServiceModalCategory(category) {
  return {
    type: types.setServiceModalCategory,
    payload: category,
  };
}
