import types from '../types/types';

/**
 * Trigger categories list update
 * @return {{payload: string, type: string}}
 */
export function triggerCategoriesUpdate() {
  return {
    type: types.updateCategoriesList,
    payload: '',
  };
}

/**
 * Trigger users list update
 * @return {{payload: string, type: string}}
 */
export function triggerUsersUpdate() {
  return {
    type: types.updateUsersList,
    payload: '',
  };
}
