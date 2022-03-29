import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import { EmailRegex, Role } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import EASModal from '../EASModal';
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

const InviteUserModal = ({
  open,
  email: propsEmail,
  type,
  error,
  isLoading,
  onClose,
  onInvite,
}) => {
  const [email, setEmail] = useState(propsEmail ?? '');
  const [role, setRole] = useState(type || Role.reception);
  const isEmailValid = email.length === 0 || email.match(EmailRegex);

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

  const handleRoleChange = (event) => {
    const newValue = event.target.value;
    setRole(newValue);
  };

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
          helperText={isEmailValid ? null : textForKey('email_invalid_message')}
          containerClass={styles.input}
          fieldLabel={textForKey('Email')}
          value={email}
          type='email'
          onChange={handleEmailChange}
        />
        <EASSelect
          label={textForKey('Role for user')}
          labelId='user-role-select'
          options={selectOptions}
          value={role}
          onChange={handleRoleChange}
        />
      </form>
      {error && (
        <span className={styles.errorMessage}>{textForKey(error)}</span>
      )}
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
