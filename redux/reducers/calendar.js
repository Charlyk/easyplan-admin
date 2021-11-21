import types from 'redux/types';

const initialState = Object.freeze({ isCalendarLoading: false });

export default function createClinicModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setIsCalendarLoading:
      return {
        ...state,
        isCalendarLoading: payload,
      };
    default:
      return state;
  }
}
