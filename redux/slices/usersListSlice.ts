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
      state.users = orderBy(action.payload.users, ['fullName'], ['asc']);
      state.invitations = action.payload.invitations;
      state.isFetching = false;
    },
    setUsers(state, action: PayloadAction<ClinicUser[]>) {
      state.users = orderBy(action.payload, ['fullName'], ['asc']);
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
  setUsers,
  fetchClinicUsers,
} = usersListSlice.actions;

export default usersListSlice.reducer;
