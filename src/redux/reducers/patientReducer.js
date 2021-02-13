import types from '../types/types';

const initialState = Object.freeze({
  smsMessages: {
    updateMessageStatus: null,
  },
});

export default function patient(state = initialState, action) {
  switch (action.type) {
    case types.setSMSMessageStatus:
      return {
        ...state,
        smsMessages: {
          ...state.smsMessages,
          updateMessageStatus: action.payload,
        },
      };
    default:
      return state;
  }
}
