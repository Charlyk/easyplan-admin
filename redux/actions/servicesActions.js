import types from 'redux/types';

export function setUpdatedService(service) {
  return {
    type: types.setUpdatedService,
    payload: service,
  };
}
