import React, { useEffect, useReducer } from 'react';

import styles from '../../styles/Users.module.scss';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import ConfirmationModal from '../../components/common/ConfirmationModal';
import InviteUserModal from '../../components/common/InviteUserModal';
import UserDetailsModal from '../../components/users/UserDetailsModal';
import { Role } from '../../utils/constants';
import { generateReducerActions, handleRequestError } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import UserItem from '../../components/users/UserItem';
import UsersHeader from '../../components/users/UserHeader';
import MainComponent from "../../components/common/MainComponent";
import axios from "axios";
import { baseAppUrl } from "../../eas.config";

const initialState = {
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

const reducerTypes = {
  setSelectedFilter: 'setSelectedFilter',
  setIsInviting: 'setIsInviting',
  setShowInvitationSent: 'setShowInvitationSent',
  setIsLoading: 'setIsLoading',
  setIsInvitingExistent: 'setIsInvitingExistent',
  setInvitingExistentError: 'setInvitingExistentError',
  setUserToDelete: 'setUserToDelete',
  setInvitationToDelete: 'setInvitationToDelete',
  setShowInviteModal: 'setShowInviteModal',
  setIsUserModalOpen: 'setIsUserModalOpen',
  setIsDeleting: 'setIsDeleting',
  setUsers: 'setUsers',
  setInvitations: 'setInvitations',
  setPageData: 'setPageData'
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setSelectedFilter:
      return { ...state, selectedFilter: action.payload };
    case reducerTypes.setIsInviting:
      return { ...state, isInviting: action.payload };
    case reducerTypes.setShowInvitationSent:
      return { ...state, showInvitationSent: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setIsInvitingExistent:
      return {
        ...state,
        isInvitingExistent: action.payload,
        invitingExistentError: action.payload ? null : state.invitingExistentError
      };
    case reducerTypes.setInvitingExistentError:
      return { ...state, invitingExistentError: action.payload};
    case reducerTypes.setUserToDelete:
      return { ...state, userToDelete: action.payload };
    case reducerTypes.setInvitationToDelete:
      return { ...state, invitationToDelete: action.payload };
    case reducerTypes.setShowInviteModal:
      return { ...state, showInviteModal: action.payload };
    case reducerTypes.setIsUserModalOpen:
      return { ...state, isUserModalOpen: action.payload };
    case reducerTypes.setIsDeleting:
      return {
        ...state,
        isDeleting: action.payload,
        userToDelete: !action.payload ? null : state.userToDelete,
        invitationToDelete: !action.payload ? null : state.invitationToDelete,
      };
    case reducerTypes.setUsers:
      return { ...state, users: action.payload };
    case reducerTypes.setInvitations:
      return { ...state, invitations: action.payload };
    case reducerTypes.setPageData:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const Users = ({ currentUser, currentClinic, users: initialUsers, invitations: initialInvitations }) => {
  const [
    {
      selectedFilter,
      isInviting,
      showInvitationSent,
      isLoading,
      isInvitingExistent,
      invitingExistentError,
      userToDelete,
      invitationToDelete,
      showInviteModal,
      isUserModalOpen,
      isDeleting,
      users,
      invitations,
    },
    localDispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(actions.setPageData({ users: initialUsers, invitations: initialInvitations }));
  }, [initialUsers]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseAppUrl}/api/users`);
      localDispatch(actions.setPageData(response.data));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFilterChange = newFilter => {
    localDispatch(actions.setSelectedFilter(newFilter));
  };

  const doctors = users.filter(item => item.roleInClinic === Role.doctor);

  const admins = users.filter(
    item =>
      item.roleInClinic === Role.admin || item.roleInClinic === Role.manager,
  );

  const reception = users.filter(
    item => item.roleInClinic === Role.reception,
  );

  const handleUserModalClose = () => {
    localDispatch(actions.setIsUserModalOpen({ ...isUserModalOpen, open: false }));
    setTimeout(() => {
      localDispatch(actions.setIsUserModalOpen({ user: null, open: false }));
    }, 300);
  };

  const handleUserModalOpen = (event, user, type = Role.manager) => {
    localDispatch(actions.setIsUserModalOpen({ open: true, user, type }));
  };

  const handleInviteUserStart = (event, type = Role.manager) => {
    openInviteModal(type === Role.invitations ? Role.reception : type);
  };

  const sendInvitation = async (email, role) => {
    return axios.put(`${baseAppUrl}/api/users/send-invitation`, {
      emailAddress: email,
      role,
    });
  }

  const handleInviteUser = async (email, role) => {
    localDispatch(actions.setIsInvitingExistent(true));
    try {
      await sendInvitation(email, role);
      await fetchUsers();
      closeInviteModal();
    } catch (error) {
      toast.error(error.message);
      localDispatch(actions.setInvitingExistentError(error.message));
    } finally {
      localDispatch(actions.setIsInvitingExistent(false));
    }
  };

  const openInviteModal = (type = Role.reception) => {
    localDispatch(actions.setShowInviteModal({ open: true, type }));
  };

  const closeInviteModal = () => {
    localDispatch(actions.setShowInviteModal({ open: false, type: Role.reception }));
  };

  const canShowType = type => {
    return selectedFilter === Role.all || selectedFilter === type;
  };

  const renderNoData = type => {
    let message = '';
    let buttonText = '';
    switch (type) {
      case Role.admin:
      case Role.manager:
        if (users.some(item => item.roleInClinic === type) || isLoading)
          return null;
        if (admins.length > 0) return null;
        message = textForKey('No managers yet.');
        buttonText = textForKey('Add manager');
        break;
      case Role.doctor:
        if (users.some(item => item.roleInClinic === type) || isLoading)
          return null;
        message = textForKey('No doctors yet.');
        buttonText = textForKey('Add doctor');
        break;
      case Role.reception:
        if (users.some(item => item.roleInClinic === type) || isLoading)
          return null;
        message = textForKey('No receptionists yet.');
        buttonText = textForKey('Add receptionist');
        break;
      case Role.invitations:
        if (invitations.length > 0 || isLoading) return null;
        message = `${textForKey('No pending invitations')}.`;
        buttonText = textForKey('Invite user');
        break;
      default:
        return null;
    }

    const role = type === Role.admin ? Role.manager : type;

    return (
      <TableRow classes={{ root: styles['users-root__no-data'] }}>
        <TableCell colSpan={5}>
          <div
            className={styles.flexContainer}
            style={{
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <Typography classes={{ root: styles['no-data-label'] }}>
              {message}
            </Typography>
            <div
              role='button'
              className={styles['add-data-btn']}
              tabIndex={0}
              onClick={event => handleInviteUserStart(event, role)}
            >
              {buttonText}
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const startUserDelete = (event, user, isInvitation) => {
    if (isInvitation) {
      localDispatch(actions.setInvitationToDelete(user));
    } else {
      localDispatch(actions.setUserToDelete(user));
    }
  };

  const closeDeleteUserDialog = () => {
    localDispatch(actions.setUserToDelete(null));
  };

  const closeDeleteInvitationDialog = () => {
    localDispatch(actions.setInvitationToDelete(null));
  };

  const handleResendInvitation = async (event, user) => {
    localDispatch(actions.setIsInviting({ loading: true, userId: user.id }));
    await sendInvitation(user.email, user.roleInClinic);
    localDispatch(actions.setIsInviting({ loading: false, userId: null }));
    localDispatch(actions.setShowInvitationSent(true));
  };

  const closeInvitationSentModal = () => {
    localDispatch(actions.setShowInvitationSent(false));
  };

  const handleRestoreUser = async (event, user) => {
    try {
      await axios.delete(`${baseAppUrl}/api/users/${user.id}/restore`);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    localDispatch(actions.setIsDeleting(true));
    try {
      await axios.delete(`${baseAppUrl}/api/users/${userToDelete.id}`);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsDeleting(false));
    }
  };

  const deleteInvitation = async () => {
    if (!invitationToDelete) return;
    localDispatch(actions.setIsDeleting(true))
    try {
      await axios.delete(`${baseAppUrl}/api/clinic/invitations?invitationId=${invitationToDelete.id}`);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsDeleting(false));
    }
  };

  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/users'
    >
      <div className={styles['users-root']}>
        <InviteUserModal
          error={invitingExistentError}
          isLoading={isInvitingExistent}
          open={showInviteModal.open}
          type={showInviteModal.type}
          onInvite={handleInviteUser}
          onClose={closeInviteModal}
        />

        <ConfirmationModal
          show={Boolean(userToDelete)}
          onClose={closeDeleteUserDialog}
          title={textForKey('Delete user')}
          message={textForKey('Are you sure you want to delete this user?')}
          onConfirm={deleteUser}
          isLoading={isDeleting}
        />

        <ConfirmationModal
          show={Boolean(invitationToDelete)}
          onClose={closeDeleteInvitationDialog}
          title={textForKey('Delete invitation')}
          message={textForKey('Are you sure you want to delete this invitation?')}
          onConfirm={deleteInvitation}
          isLoading={isDeleting}
        />

        <ConfirmationModal
          onClose={closeInvitationSentModal}
          show={showInvitationSent}
          title={textForKey('Invitation sent')}
          message={textForKey('invitation_sent_message')}
        />

        <UserDetailsModal
          currentClinic={currentClinic}
          onClose={handleUserModalClose}
          show={isUserModalOpen.open}
          user={isUserModalOpen.user}
          role={isUserModalOpen.type}
        />

        <UsersHeader
          onFilterChange={handleFilterChange}
          filter={selectedFilter}
          onInviteUser={openInviteModal}
        />

        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}

        <div className={styles['users-root__content']}>
          {!isLoading && (
            <TableContainer classes={{ root: styles['table-container'] }}>
              <Table classes={{ root: styles['data-table'] }}>
                <TableBody>
                  {canShowType(Role.invitations) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                    <span className={styles['users-root__group-title']}>
                      {textForKey('Invitations')}
                    </span>
                      </TableCell>
                    </TableRow>
                  )}
                  {canShowType(Role.invitations) &&
                  invitations.map(item => (
                    <UserItem
                      isInvitation={true}
                      isInviting={
                        isInviting.userId === item.id && isInviting.loading
                      }
                      onResend={handleResendInvitation}
                      user={item}
                      key={`invitation-${item.id}`}
                      onDelete={startUserDelete}
                      onEdit={handleUserModalOpen}
                    />
                  ))}
                  {canShowType(Role.invitations) && renderNoData(Role.invitations)}
                  {canShowType(Role.doctor) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                    <span className={styles['users-root__group-title']}>
                      {textForKey('Doctors')}
                    </span>
                      </TableCell>
                    </TableRow>
                  )}
                  {canShowType(Role.doctor) &&
                  doctors.map(item => (
                    <UserItem
                      isInviting={
                        isInviting.userId === item.id && isInviting.loading
                      }
                      onResend={handleResendInvitation}
                      user={item}
                      key={`user-${item.id}`}
                      onDelete={startUserDelete}
                      onEdit={handleUserModalOpen}
                      onRestore={handleRestoreUser}
                    />
                  ))}
                  {canShowType(Role.doctor) && renderNoData(Role.doctor)}
                  {canShowType(Role.reception) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                    <span className={styles['users-root__group-title']}>
                      {textForKey('Receptionists')}
                    </span>
                      </TableCell>
                    </TableRow>
                  )}
                  {canShowType(Role.reception) &&
                  reception.map(item => (
                    <UserItem
                      isInviting={
                        isInviting.userId === item.id && isInviting.loading
                      }
                      onResend={handleResendInvitation}
                      user={item}
                      key={`user-${item.id}`}
                      onDelete={startUserDelete}
                      onEdit={handleUserModalOpen}
                      onRestore={handleRestoreUser}
                    />
                  ))}
                  {canShowType(Role.reception) && renderNoData(Role.reception)}
                  {canShowType(Role.admin) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                    <span className={styles['users-root__group-title']}>
                      {textForKey('Administrators')}
                    </span>
                      </TableCell>
                    </TableRow>
                  )}
                  {canShowType(Role.admin) &&
                  admins.map(item => (
                    <UserItem
                      isInviting={
                        isInviting.userId === item.id && isInviting.loading
                      }
                      onResend={handleResendInvitation}
                      user={item}
                      key={`user-${item.id}`}
                      onDelete={startUserDelete}
                      onEdit={handleUserModalOpen}
                      onRestore={handleRestoreUser}
                    />
                  ))}
                  {canShowType(Role.admin) && renderNoData(Role.admin)}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const response = await axios.get(`${baseAppUrl}/api/users`, { headers: req.headers });
    return {
      props: response.data
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        users: [],
        invitations: []
      }
    }
  }
}

export default Users;
