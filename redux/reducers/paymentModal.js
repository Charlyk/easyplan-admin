import types from 'redux/types';

const initialState = Object.freeze({
  open: false,
  invoice: null,
  schedule: null,
  isNew: false,
  openPatientDetailsOnClose: false,
});

export default function paymentModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setPaymentModal:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
