import React, { useEffect, useReducer } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import { toast } from 'react-toastify';

import ConfirmationModal from '../../../common/modals/ConfirmationModal';
import InviteUserModal from '../../../../../components/common/InviteUserModal';
import { Role } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import {
  deleteUser,
  getUsers,
  inviteUser,
  restoreUser,
  updateUserCashierStatus
} from "../../../../../middleware/api/users";
import { deleteInvitation } from "../../../../../middleware/api/clinic";
import UserDetailsModal from '../UserDetailsModal';
import UserItem from '../UserItem';
import UsersHeader from '../UserHeader';
import reducer, {
  initialState,
  setPageData,
  setInvitationToDelete,
  setIsInvitingExistent,
  setShowInvitationSent,
  setIsUserModalOpen,
  setSelectedFilter,
  setUserToDelete,
  setIsInviting,
  setShowInviteModal,
  setIsDeleting,
} from './UsersList.reducer';
import styles from './UsersList.module.scss';

const UsersList = (
  {
    currentClinic,
    users: initialUsers,
    invitations: initialInvitations,
  }
) => {
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
    localDispatch(setPageData({ users: initialUsers, invitations: initialInvitations }));
  }, [initialUsers]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      localDispatch(setPageData(response.data));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFilterChange = newFilter => {
    localDispatch(setSelectedFilter(newFilter));
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
    localDispatch(setIsUserModalOpen({ ...isUserModalOpen, open: false }));
    setTimeout(() => {
      localDispatch(setIsUserModalOpen({ user: null, open: false }));
    }, 300);
  };

  const handleUserModalOpen = (event, user, type = Role.manager) => {
    localDispatch(setIsUserModalOpen({ open: true, user, type }));
  };

  const handleInviteUserStart = (event, type = Role.manager) => {
    openInviteModal(type === Role.invitations ? Role.reception : type);
  };

  const sendInvitation = async (email, role) => {
    return inviteUser({ emailAddress: email, role })
  }

  const handleInviteUser = async (email, role) => {
    localDispatch(setIsInvitingExistent(true));
    try {
      await sendInvitation(email, role);
      await fetchUsers();
      closeInviteModal();
    } catch (error) {
      toast.error(error.message);
      localDispatch(setInvitingExistentError(error.message));
    } finally {
      localDispatch(setIsInvitingExistent(false));
    }
  };

  const openInviteModal = (type = Role.reception) => {
    localDispatch(setShowInviteModal({ open: true, type }));
  };

  const closeInviteModal = () => {
    localDispatch(setShowInviteModal({ open: false, type: Role.reception }));
  };

  const canShowType = type => {
    return selectedFilter === Role.all || selectedFilter === type;
  };

  const handleUserCashierStatusChange = async (user, isCashier) => {
    try {
      await updateUserCashierStatus(user.id, isCashier);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  }

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
      localDispatch(setInvitationToDelete(user));
    } else {
      localDispatch(setUserToDelete(user));
    }
  };

  const closeDeleteUserDialog = () => {
    localDispatch(setUserToDelete(null));
  };

  const closeDeleteInvitationDialog = () => {
    localDispatch(setInvitationToDelete(null));
  };

  const handleResendInvitation = async (event, user) => {
    localDispatch(setIsInviting({ loading: true, userId: user.id }));
    await sendInvitation(user.email, user.roleInClinic);
    localDispatch(setIsInviting({ loading: false, userId: null }));
    localDispatch(setShowInvitationSent(true));
  };

  const closeInvitationSentModal = () => {
    localDispatch(setShowInvitationSent(false));
  };

  const handleRestoreUser = async (event, user) => {
    try {
      await restoreUser(user.id);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    localDispatch(setIsDeleting(true));
    try {
      await deleteUser(userToDelete.id);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsDeleting(false));
    }
  };

  const handleDeleteInvitationConfirm = async () => {
    if (!invitationToDelete) return;
    localDispatch(setIsDeleting(true))
    try {
      await deleteInvitation(invitationToDelete.id);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsDeleting(false));
    }
  };

  return (
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
        onConfirm={handleDeleteUserConfirm}
        isLoading={isDeleting}
      />

      <ConfirmationModal
        show={Boolean(invitationToDelete)}
        onClose={closeDeleteInvitationDialog}
        title={textForKey('Delete invitation')}
        message={textForKey('Are you sure you want to delete this invitation?')}
        onConfirm={handleDeleteInvitationConfirm}
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
          <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
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
                    onCashierChange={handleUserCashierStatusChange}
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
  );
};

export default UsersList;
