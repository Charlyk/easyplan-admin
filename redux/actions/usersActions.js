import types from "../types/types";

export function setUpdatedUser(user) {
  return {
    type: types.setUpdatedUser,
    payload: user,
  };
}
