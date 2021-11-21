import generateReducerActions from 'app/utils/generateReducerActions';

export const initialState = {
  isLoading: false,
  messages: [],
  isCreatingMessage: false,
  needsDeleteConfirmation: false,
  messageToDelete: null,
  isDeleting: false,
  messageToEdit: null,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setMessages: 'setMessages',
  setIsCreatingMessage: 'setIsCreatingMessage',
  setNeedsDeleteConfirmation: 'setNeedsDeleteConfirmation',
  setMessageToDelete: 'setMessageToDelete',
  setIsDeleting: 'setIsDeleting',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setIsCreatingMessage: {
      const { isCreating, message } = action.payload;
      return {
        ...state,
        isCreatingMessage: isCreating,
        messageToEdit: message,
      };
    }
    case reducerTypes.setMessages:
      return { ...state, messages: action.payload };
    case reducerTypes.setNeedsDeleteConfirmation: {
      const { confirmed, message } = action.payload;
      return {
        ...state,
        needsDeleteConfirmation: !confirmed,
        messageToDelete: confirmed ? null : message,
        isDeleting: false,
      };
    }
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    default:
      return state;
  }
};
