import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import { HYDRATE } from 'next-redux-wrapper';
import { ClinicUser } from 'types';
import initialState from '../initialState';

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: initialState.usersList,
  reducers: {
    setUsersData(
      state,
      action: PayloadAction<{ users: ClinicUser[]; invitations: any[] }>,
    ) {
      state.users = orderBy(
        action.payload.users,
        ['isHidden', 'fullName'],
        ['asc', 'asc'],
      );
      state.invitations = action.payload.invitations;
      state.isFetching = false;
    },
    setUsers(state, action: PayloadAction<ClinicUser[]>) {
      state.users = orderBy(
        action.payload,
        ['isHidden', 'fullName'],
        ['asc', 'asc'],
      );
      state.isFetching = false;
    },
    setInvitations(state, action: PayloadAction<any[]>) {
      state.invitations = action.payload;
      state.isFetching = false;
    },
    fetchClinicUsers(state) {
      state.isFetching = true;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setNewInvitation(
      state,
      action: PayloadAction<{
        email: string;
        roleInClinic: string;
        isRecentCreated: boolean;
        id: string | number;
      }>,
    ) {
      state.invitations.push(action.payload);
    },
    removeInvitation(state, action: PayloadAction<string | number>) {
      state.invitations = state.invitations.filter(
        (invitation) => invitation.id !== action.payload,
      );
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.usersList,
      };
    },
  },
});

export const {
  setUsersData,
  setError,
  setInvitations,
  removeInvitation,
  setUsers,
  fetchClinicUsers,
  setNewInvitation,
} = usersListSlice.actions;

export default usersListSlice.reducer;
