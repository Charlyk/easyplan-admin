import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconPlus from '../../../assets/icons/iconPlus';
import EasyTab from '../../../components/EasyTab';
import { Role } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';

const UsersHeader = ({ onFilterChange, filter, onAddUser, onInviteUser }) => {
  const handleTabClick = tabName => {
    onFilterChange(tabName);
  };

  return (
    <div className='users-header'>
      <div className='users-header__tabs'>
        <EasyTab
          title={textForKey('All')}
          onClick={() => handleTabClick(Role.all)}
          selected={filter === Role.all}
        />
        <EasyTab
          title={textForKey('Doctors')}
          onClick={() => handleTabClick(Role.doctor)}
          selected={filter === Role.doctor}
        />
        <EasyTab
          title={textForKey('Receptionists')}
          onClick={() => handleTabClick(Role.reception)}
          selected={filter === Role.reception}
        />
        <EasyTab
          title={textForKey('Administrators')}
          onClick={() => handleTabClick(Role.admin)}
          selected={filter === Role.admin}
        />
      </div>
      <div className='buttons-wrapper'>
        <Button
          className='positive-button'
          onClick={event => onInviteUser(event)}
        >
          {textForKey('Invite existent user')}
          <IconPlus />
        </Button>
        <Button
          className='positive-button'
          onClick={event => onAddUser(event, null)}
        >
          {textForKey('Add new user')}
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

export default UsersHeader;

UsersHeader.propTypes = {
  onFilterChange: PropTypes.func,
  filter: PropTypes.oneOf([Role.all, Role.admin, Role.reception, Role.doctor]),
  onAddUser: PropTypes.func,
  onInviteUser: PropTypes.func,
};
