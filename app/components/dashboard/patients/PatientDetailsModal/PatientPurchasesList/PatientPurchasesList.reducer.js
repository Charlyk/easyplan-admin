import generateReducerActions from "../../../../../utils/generateReducerActions";

export const initialState = {
  isLoading: false,
  payments: [],
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setPayments: 'setPayments',
};

export const actions = generateReducerActions(reducerTypes);

/**
 * Patients purchases reducer
 * @param {Object} state
 * @param {{ type: string, payload: any}} action
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setPayments:
      return { ...state, payments: action.payload };
    default:
      return state;
  }
};
