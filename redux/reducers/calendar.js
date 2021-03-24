import types from '../types/types';

const initialState = Object.freeze({ isCalendarLoading: false });

export default function createClinicModal(state = initialState, action) {
  switch (action.type) {
    case types.setIsCalendarLoading:
      return {
        ...state,
        isCalendarLoading: action.payload,
      };
    default:
      return state;
  }
}
