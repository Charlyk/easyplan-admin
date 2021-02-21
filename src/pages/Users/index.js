import React, { useEffect, useState } from 'react';

import styles from './Users.module.scss';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import ConfirmationModal from '../../components/ConfirmationModal';
import InviteUserModal from '../../components/InviteUserModal';
import UserDetailsModal from '../../components/UserDetailsModal';
import { updateUsersSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action, Role } from '../../utils/constants';
import { fetchClinicData, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import UserItem from './UserItem';
import UsersHeader from './UserHeader';
import { triggerUsersUpdate } from "../../redux/actions/actions";

const Users = () => {
  const dispatch = useDispatch();
  const updateUsers = useSelector(updateUsersSelector);
  const [selectedFilter, setSelectedFilter] = useState(Role.all);
  const [isInviting, setIsInviting] = useState({
    loading: false,
    userId: null,
  });
  const [showInvitationSent, setShowInvitationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvitingExistent, setIsInvitingExistent] = useState(false);
  const [invitingExistentError, setInvitingExistentError] = useState(null);
  const [data, setData] = useState({ users: [], invitations: [] });
  const [userToDelete, setUserToDelete] = useState(null);
  const [invitationToDelete, setInvitationToDelete] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState({
    open: false,
    type: Role.reception,
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState({
    open: false,
    user: null,
    type: Role.manager,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    logUserAction(Action.ViewUsers);
    fetchUsers();
  }, []);

  useEffect(() => {
    if (updateUsers) {
      fetchUsers(true);
      dispatch(triggerUsersUpdate(false));
    }
  }, [updateUsers]);

  const fetchUsers = async (silent = false) => {
    if (!silent) setIsLoading(true);
    const response = await dataAPI.fetchUsers();
    if (response.isError) {
      toast.error(textForKey(response.message));
      console.error(response.message);
      setData({ users: [], invitations: [] });
    } else {
      setData(response.data);
    }
    setIsLoading(false);
  };

  const handleFilterChange = newFilter => {
    setSelectedFilter(newFilter);
  };

  const doctors = data.users.filter(item => item.roleInClinic === Role.doctor);

  const admins = data.users.filter(
    item =>
      item.roleInClinic === Role.admin || item.roleInClinic === Role.manager,
  );

  const reception = data.users.filter(
    item => item.roleInClinic === Role.reception,
  );

  const handleUserModalClose = () => {
    setIsUserModalOpen({ ...isUserModalOpen, open: false });
    setTimeout(() => {
      setIsUserModalOpen({ open: false, user: null });
    }, 300);
  };

  const handleUserModalOpen = (event, user, type = Role.manager) => {
    setIsUserModalOpen({ open: true, user, type });
  };

  const handleInviteUserStart = (event, type = Role.manager) => {
    openInviteModal(type === Role.invitations ? Role.reception : type);
  };

  const handleInviteUser = async (email, role) => {
    setIsInvitingExistent(true);
    setInvitingExistentError(null);
    const response = await dataAPI.inviteUserToClinic({
      emailAddress: email,
      role,
    });
    if (response.isError) {
      setInvitingExistentError(response.message);
    } else {
      setShowInviteModal({ open: false, type: Role.reception });
    }
    setIsInvitingExistent(false);
  };

  const openInviteModal = (type = Role.reception) => {
    setShowInviteModal({ open: true, type });
  };

  const closeInviteModal = () => {
    setShowInviteModal({ open: false, type: Role.reception });
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
        if (data.users.some(item => item.roleInClinic === type) || isLoading)
          return null;
        if (admins.length > 0) return null;
        message = textForKey('No managers yet.');
        buttonText = textForKey('Add manager');
        break;
      case Role.doctor:
        if (data.users.some(item => item.roleInClinic === type) || isLoading)
          return null;
        message = textForKey('No doctors yet.');
        buttonText = textForKey('Add doctor');
        break;
      case Role.reception:
        if (data.users.some(item => item.roleInClinic === type) || isLoading)
          return null;
        message = textForKey('No receptionists yet.');
        buttonText = textForKey('Add receptionist');
        break;
      case Role.invitations:
        if (data.invitations.length > 0 || isLoading) return null;
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
          <Box
            width='100%'
            display='flex'
            alignItems='center'
            justifyContent='center'
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
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  const startUserDelete = (event, user, isInvitation) => {
    if (isInvitation) {
      setInvitationToDelete(user);
    } else {
      setUserToDelete(user);
    }
  };

  const closeDeleteUserDialog = () => {
    setUserToDelete(null);
  };

  const closeDeleteInvitationDialog = () => {
    setInvitationToDelete(null);
  };

  const handleResendInvitation = async (event, user) => {
    setIsInviting({ loading: true, userId: user.id });
    await dataAPI.inviteUserToClinic({
      emailAddress: user.email,
      role: user.roleInClinic,
    });
    setIsInviting({ loading: false, userId: null });
    setShowInvitationSent(true);
  };

  const closeInvitationSentModal = () => {
    setShowInvitationSent(false);
  };

  const handleRestoreUser = async (event, user) => {
    const response = await dataAPI.restoreUser(user.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      logUserAction(Action.RestoreUser, JSON.stringify(userToDelete));
      await fetchUsers();
      dispatch(fetchClinicData());
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    const response = await dataAPI.deleteUser(userToDelete.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
      console.error(response.message);
    } else {
      logUserAction(Action.DeleteUser, JSON.stringify(userToDelete));
      setUserToDelete(null);
      await fetchUsers();
      dispatch(fetchClinicData());
    }
    setIsDeleting(false);
  };

  const deleteInvitation = async () => {
    if (!invitationToDelete) return;
    setIsDeleting(true);
    const response = await dataAPI.deleteClinicInvitation(
      invitationToDelete.id,
    );
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      logUserAction(
        Action.DeleteInvitation,
        JSON.stringify(invitationToDelete),
      );
      setInvitationToDelete(null);
    }
    setIsDeleting(false);
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
                data.invitations.map(item => (
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
  );
};

export default Users;
