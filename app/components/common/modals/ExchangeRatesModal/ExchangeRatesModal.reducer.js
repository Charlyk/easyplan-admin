import generateReducerActions from "../../../../../utils/generateReducerActions";

export const initialState = {
  isLoading: true,
  isSaving: false,
  rates: [{ currency: 'EUR', value: 19.57 }],
  initialRates: [],
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setRates: 'setRates',
  setInitialRates: 'setInitialRates',
  setIsSaving: 'setIsSaving',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setRates:
      return { ...state, rates: action.payload };
    case reducerTypes.setInitialRates:
      return { ...state, initialRates: action.payload };
    case reducerTypes.setIsSaving:
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};
