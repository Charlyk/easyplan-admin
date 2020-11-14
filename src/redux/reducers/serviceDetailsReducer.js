import types from '../types/types';

const initialState = Object.freeze({
  open: false,
  service: null,
  category: null,
});

export default function serviceDetailsModal(state = initialState, action) {
  switch (action.type) {
    case types.setServiceModal:
      return {
        ...action.payload,
        service: !action.payload.open ? null : action.payload.service,
        category: !action.payload.open ? null : action.payload.category,
      };
    default:
      return state;
  }
}
