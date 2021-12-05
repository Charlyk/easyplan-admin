import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClinicUser } from '../../types';
import initialState from '../initialState';

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: initialState.usersList,
  reducers: {
    setUsersData(
      state,
      action: PayloadAction<{ users: ClinicUser[]; invitations: any[] }>,
    ) {
      state.users = action.payload.users;
      state.invitations = action.payload.invitations;
      state.isFetching = false;
    },
    setUsers(state, action: PayloadAction<ClinicUser[]>) {
      state.users = action.payload;
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
  },
});

export const {
  setUsersData,
  setError,
  setInvitations,
  setUsers,
  fetchClinicUsers,
} = usersListSlice.actions;

export default usersListSlice.reducer;
