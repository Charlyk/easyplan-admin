import types from '../types/types';

const initialState = Object.freeze({
  open: false,
  invoice: null,
  isNew: false,
});

export default function paymentModal(state = initialState, action) {
  switch (action.type) {
    case types.setPaymentModal:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
