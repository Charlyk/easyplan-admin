import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import { EmailRegex, Role } from '../../../app/utils/constants';
import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../../../app/components/common/EasyPlanModal';

import styles from '../../../styles/InviteUserModal.module.scss';

const InviteUserModal = ({
  open,
  type,
  error,
  isLoading,
  onClose,
  onInvite,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(type);

  useEffect(() => {
    if (!open) {
      setEmail('');
    }
  }, [open]);

  useEffect(() => {
    setRole(type);
  }, [type]);

  const handleInviteUser = () => {
    onInvite(email, role);
  };

  const handleEmailChange = event => {
    const newValue = event.target.value;
    setEmail(newValue);
  };

  const handleRoleChange = event => {
    const newValue = event.target.value;
    setRole(newValue);
  };

  const isEmailValid = email.length > 0 && !email.match(EmailRegex);

  return (
    <EasyPlanModal
      open={open}
      className={styles['invite-user-modal']}
      onClose={onClose}
      onPositiveClick={handleInviteUser}
      title={textForKey('Invite user')}
      positiveBtnText={textForKey('Invite')}
      isPositiveLoading={isLoading}
      size='sm'
      isPositiveDisabled={!email.match(EmailRegex)}
    >
      <Form.Group controlId='email'>
        <Form.Label>{textForKey('Email')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={email}
            isInvalid={isEmailValid}
            type='email'
            onChange={handleEmailChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group style={{ width: '100%' }}>
        <Form.Label>{textForKey('Role for user')}</Form.Label>
        <Form.Control
          as='select'
          onChange={handleRoleChange}
          value={role}
          custom
        >
          <option value={Role.reception}>{textForKey(Role.reception)}</option>
          <option value={Role.doctor}>{textForKey(Role.doctor)}</option>
          <option value={Role.manager}>{textForKey(Role.manager)}</option>
        </Form.Control>
      </Form.Group>
      {error && <span className={styles['error-message']}>{textForKey(error)}</span>}
    </EasyPlanModal>
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
