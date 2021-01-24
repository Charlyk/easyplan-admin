import types from '../types/types';

const initialState = Object.freeze({
  open: false,
});

export default function addPaymentModal(state = initialState, action) {
  switch (action.type) {
    case types.setExchangeRateModalOpen:
      return {
        open: action.payload,
      };
    default:
      return state;
  }
}
