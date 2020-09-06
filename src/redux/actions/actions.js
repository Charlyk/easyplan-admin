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
