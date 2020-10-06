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

/**
 * Trigger patient notes list update
 * @return {{payload: string, type: string}}
 */
export function triggerUpdateNotes() {
  return {
    type: types.updateNotes,
    payload: '',
  };
}

/**
 * Trigger patient x-ray images update
 * @return {{payload: string, type: string}}
 */
export function triggerUpdateXRay() {
  return {
    type: types.updateXRay,
    payload: '',
  };
}

/**
 * Save current user to store
 * @param user
 * @return {{payload: *, type: string}}
 */
export function setCurrentUser(user) {
  return {
    type: types.setUser,
    payload: user,
  };
}

export function triggerUpdateCurrentUser() {
  return {
    type: types.setUpdateCurrentUser,
    payload: '',
  };
}

export function changeSelectedClinic(clinicId) {
  return {
    type: types.changeCurrentClinic,
    payload: clinicId,
  };
}

/**
 * Toggle create clinic modal
 * @param {{ open: boolean, canClose: boolean }} data
 * @return {{payload: *, type: string}}
 */
export function setCreateClinic(data) {
  return {
    type: types.setCreateClinic,
    payload: data,
  };
}

export function triggerUserLogout(logout) {
  return {
    type: types.triggerUserLogOut,
    payload: logout,
  };
}
