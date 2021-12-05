import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const usersListSelector = (state: ReduxState) => state.usersList;

export const usersSelector = createSelector(
  usersListSelector,
  (data) => data.users,
);

export const invitationsSelector = createSelector(
  usersListSelector,
  (data) => data.invitations,
);

export const isFetchingUsersSelector = createSelector(
  usersListSelector,
  (data) => data.isFetching,
);

export const usersErrorSelector = createSelector(
  usersListSelector,
  (data) => data.error,
);
