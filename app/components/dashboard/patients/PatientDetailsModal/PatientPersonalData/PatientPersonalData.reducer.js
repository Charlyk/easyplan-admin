import { generateReducerActions } from "../../../../../../utils/helperFuncs";
import moment from "moment-timezone";

export const initialState = {
  isSaving: false,
  showDatePicker: false,
  firstName: '',
  lastName: '',
  birthday: null,
  email: '',
  phoneNumber: '',
  discount: 0,
  euroDebt: 0,
  country: {
    countryCode: 'md',
    dialCode: '373',
    format: '+... ... ... ... ... ..',
    name: 'Moldova'
  }
};

const reducerTypes = {
  setFirstName: 'setFirstName',
  setLastName: 'setLastName',
  setBirthday: 'setBirthday',
  setEmail: 'setEmail',
  setPhoneNumber: 'setPhoneNumber',
  setShowDatePicker: 'setShowDatePicker',
  setPatient: 'setPatient',
  setIsSaving: 'setIsSaving',
  setDiscount: 'setDiscount',
  setEuroDebt: 'setEuroDebt',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setFirstName:
      return { ...state, firstName: action.payload };
    case reducerTypes.setLastName:
      return { ...state, lastName: action.payload };
    case reducerTypes.setBirthday:
      return { ...state, birthday: action.payload, showDatePicker: false };
    case reducerTypes.setEmail:
      return { ...state, email: action.payload };
    case reducerTypes.setPhoneNumber: {
      const { isPhoneValid, newNumber, country } = action.payload;
      return { ...state, phoneNumber: newNumber, isPhoneValid, country };
    }
    case reducerTypes.setDiscount:
      return { ...state, discount: action.payload };
    case reducerTypes.setEuroDebt:
      return { ...state, euroDebt: action.payload };
    case reducerTypes.setPatient: {
      const {
        firstName,
        lastName,
        birthday,
        email,
        phoneNumber,
        discount,
        euroDebt,
      } = action.payload;
      return {
        ...state,
        firstName,
        lastName,
        birthday: birthday ? moment(birthday).toDate() : null,
        email,
        phoneNumber,
        euroDebt,
        discount: String(discount || '0'),
        isPhoneValid: true,
      };
    }
    case reducerTypes.setIsSaving:
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};
