import React from 'react';

import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';

import IconDelete from '../../assets/icons/iconDelete';
import IconEdit from '../../assets/icons/iconEdit';
import IconEmail from '../../assets/icons/iconEmail';
import IconPhone from '../../assets/icons/iconPhone';
import { textForKey } from '../../utils/localization';

const UserItem = props => {
  const { user } = props;
  return (
    <div className='user-item'>
      <div className='user-item__name-and-avatar'>
        <Image className='user-item__avatar' roundedCircle />
        <div className='user-item__name'>
          {user.firstName} {user.lastName}
        </div>
      </div>
      <div className='user-item__contact'>
        <IconPhone />
        {user.phoneNumber ? user.phoneNumber : textForKey('No phone number')}
      </div>
      <div className='user-item__contact'>
        <IconEmail />
        {user.email}
      </div>
      <div className='user-item__action-buttons'>
        <Button className='user-item__edit-button'>
          Edit <IconEdit />
        </Button>
        <Button className='user-item__delete-button'>
          Delete <IconDelete />
        </Button>
      </div>
    </div>
  );
};

export default UserItem;

UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
};
