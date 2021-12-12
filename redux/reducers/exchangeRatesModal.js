import types from '../types';

const initialState = Object.freeze({
  open: false,
});

export default function addPaymentModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setExchangeRateModalOpen:
      return {
        open: payload,
      };
    default:
      return state;
  }
}
