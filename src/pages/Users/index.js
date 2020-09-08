import React, { useState } from 'react';

import UsersHeader from './UsersHeader';
import './styles.scss';
import UserItem from './UserItem';
import { textForKey } from '../../utils/localization';

const Users = props => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleFilterChange = newFilter => {
    setSelectedFilter(newFilter);
  };

  const canShowType = type => {
    return selectedFilter === 'all' || selectedFilter === type;
  };

  return (
    <div className='users-root'>
      <UsersHeader
        onFilterChange={handleFilterChange}
        filter={selectedFilter}
      />
      <div className='users-root__content'>
        {canShowType('admins') && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Administrators')}
            </span>
            <UserItem />
            <UserItem />
          </div>
        )}
        {canShowType('reception') && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Receptionists')}
            </span>
            <UserItem />
            <UserItem />
            <UserItem />
            <UserItem />
          </div>
        )}
        {canShowType('doctors') && (
          <div className='users-root__group'>
            <span className='users-root__group-title'>
              {textForKey('Doctors')}
            </span>
            <UserItem />
            <UserItem />
            <UserItem />
            <UserItem />
            <UserItem />
            <UserItem />
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
