import initialState from '../initialState';
import types from '../types/types';

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case types.updateCategoriesList:
      return {
        ...state,
        updateCategories: !state.updateCategories,
      };
    case types.updateUsersList:
      return {
        ...state,
        updateUsers: !state.updateUsers,
      };
    case types.updateXRay:
      return {
        ...state,
        updateXRay: !state.updateXRay,
      };
    case types.updateNotes:
      return {
        ...state,
        updateNotes: !state.updateNotes,
      };
    case types.setUser:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
