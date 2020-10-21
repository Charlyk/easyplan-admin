import React, { useEffect, useState } from 'react';

import './styles.scss';

import Skeleton from '@material-ui/lab/Skeleton';
import { useDispatch, useSelector } from 'react-redux';

import ConfirmationModal from '../../components/ConfirmationModal';
import UserDetailsModal from '../../components/UserDetailsModal';
import { setClinicDoctors } from '../../redux/actions/clinicActions';
import { updateUsersSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action, Role } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import UserItem from './comps/UserItem';
import UsersHeader from './comps/UsersHeader';

const Users = props => {
  const dispatch = useDispatch();
  const updateUsers = useSelector(updateUsersSelector);
  const [selectedFilter, setSelectedFilter] = useState(Role.all);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState({
    open: false,
    user: null,
    type: Role.manager,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    logUserAction(Action.ViewUsers);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [props, updateUsers]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchUsers();
    if (response.isError) {
      console.error(response.message);
      setUsers([]);
    } else {
      setUsers(response.data);
      dispatch(
        setClinicDoctors(response.data.filter(it => it.role === Role.doctor)),
      );
    }
    setIsLoading(false);
  };

  const handleFilterChange = newFilter => {
    setSelectedFilter(newFilter);
  };

  const doctors = users.filter(item => item.role === Role.doctor);

  const admins = users.filter(
    item => item.role === Role.admin || item.role === Role.manager,
  );

  const reception = users.filter(item => item.role === Role.reception);

  const handleUserModalClose = () => {
    setIsUserModalOpen({ ...isUserModalOpen, open: false });
    setTimeout(() => {
      setIsUserModalOpen({ open: false, user: null });
    }, 300);
  };

  const handleUserModalOpen = (event, user, type = Role.manager) => {
    setIsUserModalOpen({ open: true, user, type });
  };

  const canShowType = type => {
    return selectedFilter === Role.all || selectedFilter === type;
  };

  const renderNoData = type => {
    if (users.some(item => item.role === type) || isLoading) return null;
    let message = '';
    let buttonText = '';
    switch (type) {
      case Role.admin:
      case Role.manager:
        if (admins.length > 0) return null;
        message = textForKey('No managers yet.');
        buttonText = textForKey('Add manager');
        break;
      case Role.doctor:
        message = textForKey('No doctors yet.');
        buttonText = textForKey('Add doctor');
        break;
      case Role.reception:
        message = textForKey('No receptionists yet.');
        buttonText = textForKey('Add receptionist');
        break;
      default:
        return null;
    }

    const role = type === Role.admin ? Role.manager : type;

    return (
      <div
        role='button'
        tabIndex={0}
        className='users-root__no-data'
        onClick={event => handleUserModalOpen(event, null, role)}
      >
        {message}
        <div role='button'>{buttonText}</div>
      </div>
    );
  };

  const renderSkeleton = () => {
    if (!isLoading || users.length > 0) return null;
    return (
      <div className='users-root__skeleton'>
        <Skeleton variant='rect' animation='wave' />
        <Skeleton variant='rect' animation='wave' />
        <Skeleton variant='rect' animation='wave' />
      </div>
    );
  };

  const startUserDelete = (event, user) => {
    setUserToDelete(user);
  };

  const closeDeleteUserDialog = () => {
    setUserToDelete(null);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    const response = await dataAPI.deleteUser(userToDelete.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      logUserAction(Action.DeleteUser, JSON.stringify(userToDelete));
      setUserToDelete(null);
      await fetchUsers();
    }
    setIsDeleting(false);
  };

  return (
    <div className='users-root'>
      <ConfirmationModal
        show={Boolean(userToDelete)}
        onClose={closeDeleteUserDialog}
        title={textForKey('Delete user')}
        message={textForKey('Are you sure you want to delete this user?')}
        onConfirm={deleteUser}
        isLoading={isDeleting}
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
        onAddUser={handleUserModalOpen}
      />
      <div className='users-root__content'>
        {canShowType(Role.doctor) && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Doctors')}
            </span>
            {doctors.map(item => (
              <UserItem
                user={item}
                key={item.id}
                onDelete={startUserDelete}
                onEdit={handleUserModalOpen}
              />
            ))}
            {renderSkeleton()}
            {renderNoData(Role.doctor)}
          </div>
        )}
        {canShowType(Role.reception) && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Receptionists')}
            </span>
            {reception.map(item => (
              <UserItem
                user={item}
                key={item.id}
                onDelete={startUserDelete}
                onEdit={handleUserModalOpen}
              />
            ))}
            {renderSkeleton()}
            {renderNoData(Role.reception)}
          </div>
        )}
        {canShowType(Role.admin) && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Administrators')}
            </span>
            {admins.map(item => (
              <UserItem
                user={item}
                key={item.id}
                onDelete={startUserDelete}
                onEdit={handleUserModalOpen}
              />
            ))}
            {renderSkeleton()}
            {renderNoData(Role.admin)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
