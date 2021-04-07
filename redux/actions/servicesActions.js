import types from "../types/types";

export function setUpdatedService(service) {
  return {
    type: types.setUpdatedService,
    payload: service,
  };
}
