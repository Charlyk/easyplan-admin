import generateReducerActions from "../../../../utils/generateReducerActions";
import {
  availableHours,
  messageTypeEnum
} from '../CreateMessageDialog/CreateMessageDialog.constants'
import moment from "moment-timezone";

export const initialState = {
  isLoading: false,
  language: 'ro',
  message: { ro: '', en: '', ru: '' },
  messageTitle: '',
  messageType: messageTypeEnum.ScheduleNotification,
  hourToSend: availableHours[0],
  showDatePicker: false,
  messageDate: new Date(),
  maxLength: 160,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setMessage: 'setMessage',
  setMessageTitle: 'setMessageTitle',
  setLanguage: 'setLanguage',
  setMessageType: 'setMessageType',
  setShowDatePicker: 'setShowDatePicker',
  setMessageDate: 'setMessageDate',
  setHourToSend: 'setHourToSend',
  setMaxLength: 'setMaxLength',
  setMessageData: 'setMessageData',
  resetState: 'resetState',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setLanguage:
      return { ...state, language: action.payload };
    case reducerTypes.setMessage: {
      return {
        ...state,
        message: { ...state.message, ...action.payload },
      };
    }
    case reducerTypes.setMessageTitle:
      return { ...state, messageTitle: action.payload };
    case reducerTypes.setMessageType:
      return { ...state, messageType: action.payload };
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setMessageDate:
      return { ...state, messageDate: action.payload, showDatePicker: false };
    case reducerTypes.setHourToSend:
      return { ...state, hourToSend: action.payload };
    case reducerTypes.setMaxLength:
      return { ...state, maxLength: action.payload };
    case reducerTypes.setMessageData: {
      const message = action.payload;
      return {
        ...state,
        messageTitle: message.title,
        message: JSON.parse(message.message),
        messageType: message.type,
        hourToSend: message.hour,
        messageDate: moment(message.sendDate).toDate(),
      };
    }
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};
