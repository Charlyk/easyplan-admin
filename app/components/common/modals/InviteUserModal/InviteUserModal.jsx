import React, { useEffect, useState, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useSelector } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import { EmailRegex, Role } from 'app/utils/constants';
import { paymentsSubscriptionSelector } from 'redux/selectors/paymentsSelector';
import { invitationsSelector } from 'redux/selectors/usersListSelector';
import useMappedValue from '../../../../utils/hooks/useMappedValue';
import EASModal from '../EASModal';
import styles from './InviteUserModal.module.scss';

const rawSelectOptions = [
  {
    id: Role.reception,
    name: Role.reception,
  },
  {
    id: Role.doctor,
    name: Role.doctor,
  },
  {
    id: Role.manager,
    name: Role.manager,
  },
];

const InviteUserModal = ({
  open,
  type,
  error,
  isLoading,
  onClose,
  onInvite,
}) => {
  const textForKey = useTranslate();
  const selectOptions = useMappedValue(rawSelectOptions);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(type || Role.reception);
  const isEmailValid = email.length === 0 || email.match(EmailRegex);
  const invitations = useSelector(invitationsSelector);
  const { data: subscription } = useSelector(paymentsSubscriptionSelector);

  const doctorSelectedAndInsufficientSeats = useMemo(() => {
    const doctorsInvitesSent = invitations.filter(
      (invitation) => invitation.roleInClinic === Role.doctor,
    );

    const availableSeatsLeftAfterInviteSent =
      subscription.availableSeats - doctorsInvitesSent.length;

    return (
      role === Role.doctor &&
      (subscription.availableSeats === 0 ||
        availableSeatsLeftAfterInviteSent < 1)
    );
  }, [subscription.availableServices, role]);

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
      title={textForKey('invite user')}
      primaryBtnText={textForKey('invite')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={
        !email.match(EmailRegex) || doctorSelectedAndInsufficientSeats
      }
    >
      <form className={styles.content} onSubmit={handleInviteUser}>
        <EASTextField
          autoFocus
          error={!isEmailValid}
          helperText={isEmailValid ? null : textForKey('email_invalid_message')}
          containerClass={styles.input}
          fieldLabel={textForKey('email')}
          type='email'
          onChange={handleEmailChange}
        />
        <EASSelect
          label={textForKey('role for user')}
          labelId='user-role-select'
          options={selectOptions}
          value={role}
          onChange={handleRoleChange}
        />
        {doctorSelectedAndInsufficientSeats && (
          <Alert severity={'warning'} classes={{ root: styles.alertContainer }}>
            <Box display={'flex'} alignItems={'center'}>
              <Typography>{} </Typography>
              <Typography>
                {textForKey('insufficient_seats')}. {textForKey('go_to')}{' '}
                <Link href={'/settings/billing-details'}>
                  <a>{textForKey('billing_details')}</a>
                </Link>
              </Typography>
            </Box>
          </Alert>
        )}
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
