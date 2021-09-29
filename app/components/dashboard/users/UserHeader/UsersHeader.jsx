import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import IconPlus from '../../../icons/iconPlus';
import EasyTab from '../../../common/EasyTab';
import { Role } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import styles from './UserHeader.module.scss'

const UsersHeader = ({ onFilterChange, filter, onInviteUser }) => {
  const handleTabClick = tabName => {
    onFilterChange(tabName);
  };

  return (
    <div className={styles['users-header']}>
      <div className={styles['users-header__tabs']}>
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
        <EasyTab
          title={textForKey('Invitations')}
          onClick={() => handleTabClick(Role.invitations)}
          selected={filter === Role.invitations}
        />
      </div>
      <div className={styles['buttons-wrapper']}>
        <Button
          className={'positive-button'}
          onClick={() => onInviteUser(Role.reception)}
        >
          {textForKey('Invite user')}
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

export default UsersHeader;

UsersHeader.propTypes = {
  onFilterChange: PropTypes.func,
  filter: PropTypes.oneOf([
    Role.all,
    Role.admin,
    Role.reception,
    Role.doctor,
    Role.invitations,
  ]),
  onInviteUser: PropTypes.func,
};
