import initialState from '../initialState';
import types from '../types/types';

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case types.updateCategoriesList:
      return {
        ...state,
        updateCategories: !state.updateCategories,
      };
    default:
      return state;
  }
}
