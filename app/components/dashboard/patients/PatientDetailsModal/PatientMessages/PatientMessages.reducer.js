import generateReducerActions from "../../../../../../utils/generateReducerActions";

export const charactersRegex = /[а-яА-ЯЁёĂăÎîȘșȚțÂâ]/;

export const initialState = {
  isFetching: false,
  isSendingMessage: false,
  messages: [],
  newMessageText: '',
  maxLength: 160,
};

const reducerTypes = {
  setIsFetching: 'setIsFetching',
  setMessages: 'setMessages',
  setNewMessageText: 'setNewMessageText',
  setIsSendingMessage: 'setIsSendingMessage',
  setMaxLength: 'setMaxLength',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setNewMessageText:
      return { ...state, newMessageText: action.payload };
    case reducerTypes.setMessages:
      return { ...state, messages: action.payload };
    case reducerTypes.setIsSendingMessage:
      return { ...state, isSendingMessage: action.payload };
    case reducerTypes.setMaxLength:
      return { ...state, maxLength: action.payload };
    default:
      return state;
  }
};
