import generateReducerActions from "../../../../../utils/generateReducerActions";
import { EmailRegex } from "../../../../utils/constants";

export const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isPhoneValid: false,
  phoneCountry: { countryCode: 'md', dialCode: '373' },
  email: '',
  isEmailValid: false,
  birthday: null,
  isLoading: false,
  showBirthdayPicker: false,
};

const reducerTypes = {
  setFirstName: 'setFirstName',
  setLastName: 'setLastName',
  setPhoneNumber: 'setPhoneNumber',
  setEmail: 'setEmail',
  setBirthday: 'setBirthday',
  setIsLoading: 'setIsLoading',
  setShowBirthdayPicker: 'setShowBirthdayPicker',
  resetState: 'resetState',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setFirstName:
      return { ...state, firstName: action.payload };
    case reducerTypes.setLastName:
      return { ...state, lastName: action.payload };
    case reducerTypes.setPhoneNumber: {
      const { phoneNumber, isPhoneValid, country } = action.payload;
      return { ...state, phoneNumber, isPhoneValid, phoneCountry: country };
    }
    case reducerTypes.setBirthday:
      return { ...state, birthday: action.payload, showBirthdayPicker: false };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setEmail:
      return {
        ...state,
        email: action.payload,
        isEmailValid: action.payload.match(EmailRegex),
      };
    case reducerTypes.setShowBirthdayPicker:
      return { ...state, showBirthdayPicker: action.payload };
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};
