import types from 'redux/types';

const initialState = Object.freeze({
  open: false,
  patient: null,
});

export default function addPaymentModal(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case types.setAddPaymentModal: {
      const { open, patient } = payload;
      return {
        open,
        patient: open ? patient : null,
      };
    }
    default:
      return state;
  }
}
