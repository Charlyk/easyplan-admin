import React, { useEffect, useState } from 'react';

import './styles.scss';

import Skeleton from '@material-ui/lab/Skeleton';

import ConfirmationModal from '../../components/ConfirmationModal';
import UserDetailsModal from '../../components/UserDetailsModal';
import dataAPI from '../../utils/api/dataAPI';
import { Role } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import UserItem from './UserItem';
import UsersHeader from './UsersHeader';

const Users = props => {
  const [selectedFilter, setSelectedFilter] = useState(Role.all);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [props]);

  const fetchUsers = () => {
    setIsLoading(true);
    dataAPI
      .fetchUsers()
      .then(response => {
        setIsLoading(false);
        if (!response.isError) {
          setUsers(response.data);
        }
      })
      .catch(error => {
        setUsers([]);
        setIsLoading(false);
        console.error(error);
      });
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
    setIsUserModalOpen(false);
  };

  const handleUserModalOpen = user => {
    setIsUserModalOpen(true);
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

    return (
      <div className='users-root__no-data'>
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

  const startUserDelete = user => {
    setUserToDelete(user);
  };

  const closeDeleteUserDialog = () => {
    setUserToDelete(null);
  };

  const deleteUser = () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    dataAPI
      .deleteUser(userToDelete.id)
      .then(response => {
        setIsDeleting(false);
        if (response.isError) {
          console.error(response);
        } else {
          setUserToDelete(null);
        }
      })
      .catch(error => {
        console.error(error);
        setIsDeleting(false);
      });
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

      <UserDetailsModal onClose={handleUserModalClose} show={isUserModalOpen} />
      <UsersHeader
        onFilterChange={handleFilterChange}
        filter={selectedFilter}
        onAddUser={handleUserModalOpen}
      />
      <div className='users-root__content'>
        {canShowType(Role.admin) && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Administrators')}
            </span>
            {admins.map(item => (
              <UserItem user={item} key={item.id} onDelete={startUserDelete} />
            ))}
            {renderSkeleton()}
            {renderNoData(Role.admin)}
          </div>
        )}
        {canShowType(Role.reception) && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Receptionists')}
            </span>
            {reception.map(item => (
              <UserItem user={item} key={item.id} onDelete={startUserDelete} />
            ))}
            {renderSkeleton()}
            {renderNoData(Role.reception)}
          </div>
        )}
        {canShowType(Role.doctor) && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Doctors')}
            </span>
            {doctors.map(item => (
              <UserItem user={item} key={item.id} onDelete={startUserDelete} />
            ))}
            {renderSkeleton()}
            {renderNoData(Role.doctor)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
