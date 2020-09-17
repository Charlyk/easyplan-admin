import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconPlus from '../../assets/icons/iconPlus';
import { Role } from '../../utils/constants';
import { textForKey } from '../../utils/localization';

const Tab = ({ title, selected, onClick }) => {
  const tabClass = clsx('users-header__tab', selected ? 'selected' : 'default');
  return (
    <div onClick={onClick} className={tabClass}>
      {title}
      <div className='tab-indicator' />
    </div>
  );
};

const UsersHeader = ({ onFilterChange, filter, onAddUser }) => {
  const handleTabClick = tabName => {
    onFilterChange(tabName);
  };

  return (
    <div className='users-header'>
      <div className='users-header__tabs'>
        <Tab
          title={textForKey('All')}
          onClick={() => handleTabClick(Role.all)}
          selected={filter === Role.all}
        />
        <Tab
          title={textForKey('Doctors')}
          onClick={() => handleTabClick(Role.doctor)}
          selected={filter === Role.doctor}
        />
        <Tab
          title={textForKey('Receptionists')}
          onClick={() => handleTabClick(Role.reception)}
          selected={filter === Role.reception}
        />
        <Tab
          title={textForKey('Administrators')}
          onClick={() => handleTabClick(Role.admin)}
          selected={filter === Role.admin}
        />
      </div>
      <Button className='positive-button' onClick={onAddUser}>
        {textForKey('Add new user')}
        <IconPlus />
      </Button>
    </div>
  );
};

export default UsersHeader;

Tab.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

UsersHeader.propTypes = {
  onFilterChange: PropTypes.func,
  filter: PropTypes.oneOf([Role.all, Role.admin, Role.reception, Role.doctor]),
  onAddUser: PropTypes.func,
};
