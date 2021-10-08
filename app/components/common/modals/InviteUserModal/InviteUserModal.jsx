import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { EmailRegex, Role } from '../../../../utils/constants';
import { textForKey } from '../../../../utils/localization';
import EASTextField from "../../EASTextField";
import EASSelect from "../../EASSelect";
import EASModal from "../EASModal";
import styles from './InviteUserModal.module.scss';

const selectOptions = [
  {
    id: Role.reception,
    name: textForKey(Role.reception),
  },
  {
    id: Role.doctor,
    name: textForKey(Role.doctor),
  },
  {
    id: Role.manager,
    name: textForKey(Role.manager),
  },
];

const InviteUserModal = (
  {
    open,
    type,
    error,
    isLoading,
    onClose,
    onInvite,
  }
) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(type || Role.reception);

  useEffect(() => {
    if (!open) {
      setEmail('');
    }
  }, [open]);

  useEffect(() => {
    setRole(type);
  }, [type]);

  const handleInviteUser = (event) => {
    event?.preventDefault();
    onInvite(email, role);
  };

  const handleEmailChange = (newValue) => {
    setEmail(newValue);
  };

  const handleRoleChange = event => {
    const newValue = event.target.value;
    setRole(newValue);
  };

  const isEmailValid = email.length === 0 || email.match(EmailRegex);

  return (
    <EASModal
      open={open}
      className={styles.inviteUserModal}
      onClose={onClose}
      onPrimaryClick={handleInviteUser}
      title={textForKey('Invite user')}
      primaryBtnText={textForKey('Invite')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={!email.match(EmailRegex)}
    >
      <form className={styles.content} onSubmit={handleInviteUser}>
        <EASTextField
          autoFocus
          error={!isEmailValid}
          containerClass={styles.input}
          fieldLabel={textForKey('Email')}
          type="email"
          onChange={handleEmailChange}
        />
        <EASSelect
          label={textForKey('Role for user')}
          labelId="user-role-select"
          options={selectOptions}
          value={role}
          onChange={handleRoleChange}
        />
      </form>
      {error && <span className={styles.errorMessage}>{textForKey(error)}</span>}
    </EASModal>
  );
};

export default InviteUserModal;

InviteUserModal.propTypes = {
  error: PropTypes.string,
  open: PropTypes.bool,
  type: PropTypes.oneOf([Role.reception, Role.manager, Role.doctor]),
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onInvite: PropTypes.func,
};
