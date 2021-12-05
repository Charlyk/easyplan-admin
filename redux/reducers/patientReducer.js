import types from '../types';

const initialState = Object.freeze({
  smsMessages: {
    updateMessageStatus: null,
  },
});

export default function patient(state = initialState, { type, payload } = {}) {
  switch (type) {
    case types.setSMSMessageStatus:
      return {
        ...state,
        smsMessages: {
          ...state.smsMessages,
          updateMessageStatus: payload,
        },
      };
    default:
      return state;
  }
}
