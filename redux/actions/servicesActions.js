import types from '../types';

export function setUpdatedService(service) {
  return {
    type: types.setUpdatedService,
    payload: service,
  };
}
