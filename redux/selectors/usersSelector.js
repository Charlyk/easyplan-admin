import { createSelector } from "reselect";

export const usersSelector = (state) => state.users;

export const updatedUserSelector = createSelector(
  usersSelector,
  (users) => users?.updatedUser,
);
