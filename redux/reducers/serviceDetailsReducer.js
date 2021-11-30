import types from '../types';

const initialState = Object.freeze({
  open: false,
  service: null,
  category: null,
});

export default function serviceDetailsModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.closeServiceDetailsModal:
      return { ...state, open: !payload };
    case types.setServiceModalCategory:
      return { ...state, category: payload };
    case types.setServiceModalService:
      return { ...state, service: payload };
    case types.setServiceModal:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
