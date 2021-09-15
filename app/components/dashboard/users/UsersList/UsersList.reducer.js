import { createSlice } from "@reduxjs/toolkit";
import orderBy from 'lodash/orderBy';
import { Role } from "../../../../utils/constants";

export const initialState = {
  selectedFilter: Role.all,
  isInviting: {
    loading: false,
    userId: null,
  },
  showInvitationSent: false,
  isLoading: false,
  isInvitingExistent: false,
  userToDelete: null,
  invitationToDelete: null,
  showInviteModal: {
    open: false,
    type: Role.reception
  },
  isUserModalOpen: {
    open: false,
    user: null,
    type: Role.manager,
  },
  isDeleting: false,
  users: [],
  invitations: [],
};

const usersListSlice = createSlice({
  name: 'usersList',
  initialState,
  reducers: {
    setSelectedFilter(state, action) {
      state.selectedFilter = action.payload;
    },
    setIsInviting(state, action) {
      state.isInviting = action.payload;
    },
    setShowInvitationSent(state, action) {
      state.showInvitationSent = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setIsInvitingExistent(state, action) {
      state.isInvitingExistent = action.payload;
      state.invitingExistentError = action.payload ? null : state.invitingExistentError
    },
    setIsInvitingExistentError(state, action) {
      state.invitingExistentError = action.payload;
    },
    setUserToDelete(state, action) {
      state.userToDelete = action.payload;
    },
    setInvitationToDelete(state, action) {
      state.invitationToDelete = action.payload;
    },
    setShowInviteModal(state, action) {
      state.showInviteModal = action.payload;
    },
    setIsUserModalOpen(state, action) {
      state.isUserModalOpen = action.payload;
    },
    setIsDeleting(state, action) {
      state.isDeleting = action.payload;
      state.userToDelete = !action.payload ? null : state.userToDelete;
      state.invitationToDelete = !action.payload ? null : state.invitationToDelete
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setInvitations(state, action) {
      state.invitations = action.payload;
    },
    setPageData(state, action) {
      state.users = orderBy(action.payload.users, ['isHidden', 'fullName'], ['asc', 'asc']);
      state.invitations = action.payload.invitations;
    },
  },
});

export const {
  setIsInvitingExistent,
  setPageData,
  setInvitationToDelete,
  setIsInviting,
  setShowInvitationSent,
  setUsers,
  setIsLoading,
  setSelectedFilter,
  setShowInviteModal,
  setIsDeleting,
  setIsUserModalOpen,
  setUserToDelete,
  setIsInvitingExistentError
} = usersListSlice.actions;

export default usersListSlice.reducer;
