import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import EasyTab from 'app/components/common/EasyTab';
import IconPlus from 'app/components/icons/iconPlus';
import { Role } from 'app/utils/constants';
import styles from './UserHeader.module.scss';

const UsersHeader = ({ onFilterChange, filter, onInviteUser }) => {
  const textForKey = useTranslate();
  const handleTabClick = (tabName) => {
    onFilterChange(tabName);
  };

  return (
    <div className={styles['users-header']}>
      <div className={styles['users-header__tabs']}>
        <EasyTab
          title={textForKey('all')}
          onClick={() => handleTabClick(Role.all)}
          selected={filter === Role.all}
        />
        <EasyTab
          title={textForKey('doctors')}
          onClick={() => handleTabClick(Role.doctor)}
          selected={filter === Role.doctor}
        />
        <EasyTab
          title={textForKey('receptionists')}
          onClick={() => handleTabClick(Role.reception)}
          selected={filter === Role.reception}
        />
        <EasyTab
          title={textForKey('administrators')}
          onClick={() => handleTabClick(Role.admin)}
          selected={filter === Role.admin}
        />
        <EasyTab
          title={textForKey('invitations')}
          onClick={() => handleTabClick(Role.invitations)}
          selected={filter === Role.invitations}
        />
      </div>
      <div className={styles['buttons-wrapper']}>
        <Button
          classes={{
            root: styles.inviteButton,
          }}
          onPointerUp={() => onInviteUser(Role.reception)}
        >
          {textForKey('invite user')}
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
