import generateReducerActions from 'app/utils/generateReducerActions';

export const initialState = {
  isFetching: false,
  isAddingNote: false,
  notes: [],
  newNoteText: '',
};

const reducerTypes = {
  setIsFetching: 'setIsFetching',
  setNotes: 'setNotes',
  setNewNoteText: 'setNewNoteText',
  setIsAddingNote: 'setIsAddingNote',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setNewNoteText:
      return { ...state, newNoteText: action.payload };
    case reducerTypes.setNotes:
      return { ...state, notes: action.payload };
    default:
      return state;
  }
};
