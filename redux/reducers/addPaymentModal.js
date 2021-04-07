import types from '../types/types';

const initialState = Object.freeze({
  open: false,
  patient: null,
});

export default function addPaymentModal(state = initialState, action) {
  switch (action.type) {
    case types.setAddPaymentModal: {
      const { open, patient } = action.payload;
      return {
        open,
        patient: open ? patient : null,
      };
    }
    default:
      return state;
  }
}
