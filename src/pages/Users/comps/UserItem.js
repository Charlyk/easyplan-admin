import React from 'react';

import { Box, TableCell, TableRow, Typography } from '@material-ui/core';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
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

const UserItem = ({
  user,
  isInvitation,
  isInviting,
  onDelete,
  onEdit,
  onResend,
  onRestore,
}) => {
  const handleDeleteUser = event => {
    onDelete(event, user, isInvitation);
  };

  const handleRestoreUser = event => {
    onRestore(event, user);
  };

  const handleEditUser = event => {
    onEdit(event, user);
  };

  const handleResendInvitation = event => {
    onResend(event, user);
  };

  const rootClasses = clsx('user-item', user.isHidden ? 'fired' : 'active');

  return (
    <TableRow classes={{ root: rootClasses }}>
      {!isInvitation && (
        <TableCell
          valign='middle'
          classes={{ root: 'user-item__name-and-avatar' }}
        >
          <Box height='100%' display='flex' alignItems='center'>
            <div
              className={clsx(
                'status-indicator',
                user.isHidden ? 'fired' : 'active',
              )}
            />
            <div className='user-item__avatar'>
              {user.avatar ? (
                <Image
                  className='user-item__avatar'
                  roundedCircle
                  src={urlToLambda(user.avatar)}
                />
              ) : (
                <IconAvatar />
              )}
            </div>
            <Typography classes={{ root: 'user-item__name' }}>
              {upperFirst(user.firstName.toLowerCase())}{' '}
              {upperFirst(user.lastName.toLowerCase())}
            </Typography>
          </Box>
        </TableCell>
      )}
      {!isInvitation && (
        <TableCell valign='middle' classes={{ root: 'user-item__contact' }}>
          <Box display='flex' alignItems='center'>
            <IconPhone />
            <Typography classes={{ root: 'contact-label' }}>
              {user.phoneNumber
                ? user.phoneNumber
                : textForKey('No phone number')}
            </Typography>
          </Box>
        </TableCell>
      )}
      <TableCell
        valign='middle'
        colSpan={isInvitation ? 3 : 1}
        classes={{ root: 'user-item__contact' }}
      >
        <Box display='flex' alignItems='center'>
          <IconEmail />
          <Typography classes={{ root: 'contact-label' }}>
            {user.email}
          </Typography>
        </Box>
      </TableCell>
      <TableCell valign='middle'>
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
          {user.isHidden ? (
            <Button
              className='user-item__restore-button'
              onClick={handleRestoreUser}
            >
              {textForKey('Restore')} <IconRefresh fill='#00E987' />
            </Button>
          ) : (
            <Button
              className='user-item__delete-button'
              onClick={handleDeleteUser}
            >
              {textForKey('Delete')} <IconDelete />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
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
    isHidden: PropTypes.bool,
  }).isRequired,
  onResend: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onEdit: PropTypes.func,
};

UserItem.defaultProps = {
  onDelete: () => null,
  onEdit: () => null,
  onResend: () => null,
  onRestore: () => null,
  isInvitation: false,
};
