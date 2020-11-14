import types from '../types/types';

const initialState = Object.freeze({
  open: false,
  service: null,
  category: null,
});

export default function serviceDetailsModal(state = initialState, action) {
  switch (action.type) {
    case types.closeServiceDetailsModal:
      return { ...state, open: !action.payload };
    case types.setServiceModalCategory:
      return { ...state, category: action.payload };
    case types.setServiceModalService:
      return { ...state, service: action.payload };
    case types.setServiceModal:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
