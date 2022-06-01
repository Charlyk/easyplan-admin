import { EmailRegex } from 'app/utils/constants';
import generateReducerActions from 'app/utils/generateReducerActions';

export const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isPhoneValid: false,
  idnp: '',
  identityCardSeries: '',
  identityCardNumber: '',
  address: '',
  employerCertificate: '',
  language: 'ro',
  source: 'Unknown',
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
  setLanguage: 'setLanguage',
  setSource: 'setSource',
  setIDNP: 'setIdnp',
  setIdentityCardSeries: 'setIdentityCardSeries',
  setIdentityCardNumber: 'setIdentityCardNumber',
  setAddress: 'setAddress',
  setEmployerCertificate: 'setEmployerCertificate',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIDNP:
      return { ...state, idnp: action.payload };
    case reducerTypes.setIdentityCardSeries:
      return { ...state, identityCardSeries: action.payload };
    case reducerTypes.setIdentityCardNumber:
      return { ...state, identityCardNumber: action.payload };
    case reducerTypes.setAddress:
      return { ...state, address: action.payload };
    case reducerTypes.setEmployerCertificate:
      return { ...state, employerCertificate: action.payload };
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
    case reducerTypes.setLanguage:
      return { ...state, language: action.payload };
    case reducerTypes.setSource:
      return { ...state, source: action.payload };
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};
