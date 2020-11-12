import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

import './styles.scss';
import { Form, InputGroup } from 'react-bootstrap';

import { EmailRegex, Role } from '../../utils/constants';

const InviteUserModal = ({ open, error, isLoading, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(Role.reception);

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
      className='invite-user-modal'
      onClose={onClose}
      onPositiveClick={handleInviteUser}
      title={textForKey('Invite existent user')}
      positiveBtnText={textForKey('Invite')}
      isPositiveLoading={isLoading}
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
      {error && <span className='error-message'>{textForKey(error)}</span>}
    </EasyPlanModal>
  );
};

export default InviteUserModal;

InviteUserModal.propTypes = {
  error: PropTypes.string,
  open: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onInvite: PropTypes.func,
};
