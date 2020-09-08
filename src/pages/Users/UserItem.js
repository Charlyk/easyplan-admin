import React from 'react';

import { Button, Image } from 'react-bootstrap';

import IconDelete from '../../assets/icons/iconDelete';
import IconEdit from '../../assets/icons/iconEdit';
import IconEmail from '../../assets/icons/iconEmail';
import IconPhone from '../../assets/icons/iconPhone';

const UserItem = props => {
  return (
    <div className='user-item'>
      <div className='user-item__name-and-avatar'>
        <Image className='user-item__avatar' roundedCircle />
        <div className='user-item__name'>User Name</div>
      </div>
      <div className='user-item__contact'>
        <IconPhone />
        +37379466284
      </div>
      <div className='user-item__contact'>
        <IconEmail />
        eduard.albu@gmail.com
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
