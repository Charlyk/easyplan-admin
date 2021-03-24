import { createSelector } from "reselect";

export const servicesSelector = (state) => state.services;

export const updatedServiceSelector = createSelector(
  servicesSelector,
  (services) => services?.updatedService,
);
