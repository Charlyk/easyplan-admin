import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';

import IconAvatar from '../../../assets/icons/iconAvatar';
import IconDelete from '../../../assets/icons/iconDelete';
import IconEdit from '../../../assets/icons/iconEdit';
import IconEmail from '../../../assets/icons/iconEmail';
import IconPhone from '../../../assets/icons/iconPhone';
import IconRefresh from '../../../assets/icons/iconRefresh';
import LoadingButton from '../../../components/LoadingButton';
import { Role } from '../../../utils/constants';
import { urlToLambda } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';

const UserItem = props => {
  const { user, isInvitation, isInviting, onDelete, onEdit, onResend } = props;

  const handleDeleteUser = event => {
    onDelete(event, user, isInvitation);
  };

  const handleEditUser = event => {
    onEdit(event, user);
  };

  const handleResendInvitation = event => {
    onResend(event, user);
  };

  const rootClasses = clsx('user-item', user.status?.toLowerCase());

  return (
    <div className={rootClasses}>
      {!isInvitation && (
        <div className='user-item__name-and-avatar'>
          {user.avatar ? (
            <Image
              className='user-item__avatar'
              roundedCircle
              src={urlToLambda(user.avatar)}
            />
          ) : (
            <IconAvatar />
          )}
          <div className='user-item__name'>
            {user.firstName} {user.lastName}
          </div>
        </div>
      )}
      {!isInvitation && (
        <div className='user-item__contact'>
          <IconPhone />
          {user.phoneNumber ? user.phoneNumber : textForKey('No phone number')}
        </div>
      )}
      <div className='user-item__contact'>
        <IconEmail />
        {user.email}
      </div>
      <div className='user-item__action-buttons'>
        {user.status === 'Pending' ||
          (isInvitation && (
            <LoadingButton
              isLoading={isInviting}
              className='user-item__resend-button'
              onClick={handleResendInvitation}
            >
              {textForKey('Invite')} <IconRefresh fill='#FDC534' />
            </LoadingButton>
          ))}
        {user.roleInClinic === Role.doctor && !isInvitation && (
          <Button className='user-item__edit-button' onClick={handleEditUser}>
            {textForKey('Edit')} <IconEdit />
          </Button>
        )}
        <Button className='user-item__delete-button' onClick={handleDeleteUser}>
          {textForKey('Delete')} <IconDelete />
        </Button>
      </div>
    </div>
  );
};

export default UserItem;

UserItem.propTypes = {
  isInviting: PropTypes.bool,
  isInvitation: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roleInClinic: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onResend: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

UserItem.defaultProps = {
  onDelete: () => null,
  onEdit: () => null,
  onResend: () => null,
  isInvitation: false,
};
