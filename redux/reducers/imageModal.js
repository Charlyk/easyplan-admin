import types from 'redux/types';

const initialState = Object.freeze({ open: false, imageUrl: null });

export default function imageModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setImageModal:
      return {
        ...payload,
        imageUrl: payload.open ? payload.imageUrl : null,
      };
    default:
      return state;
  }
}
