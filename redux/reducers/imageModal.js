import types from '../types/types';

const initialState = Object.freeze({ open: false, imageUrl: null });

export default function imageModal(state = initialState, action) {
  switch (action.type) {
    case types.setImageModal:
      return {
        ...action.payload,
        imageUrl: action.payload.open ? action.payload.imageUrl : null,
      };
    default:
      return state;
  }
}
