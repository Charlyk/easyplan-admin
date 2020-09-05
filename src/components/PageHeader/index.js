import React from 'react';

import './styles.scss';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

import IconMore from '../../assets/icons/iconMore';
import IconNotifications from '../../assets/icons/iconNotifications';
import profileImage from '../../assets/images/profile-image.jpg';
import { textForKey } from '../../utils/localization';

const PageHeader = props => {
  const { title, onSearch } = props;

  return (
    <div className='page-header'>
      <div className='page-header__title'>{title}</div>
      <TextField
        variant='outlined'
        placeholder={textForKey('Search')}
        onChange={onSearch}
      />
      <div className='page-header__actions'>
        <div className='page-header__notifications'>
          <IconNotifications />
        </div>
        <Image
          roundedCircle
          className='page-header__avatar'
          src={profileImage}
        />
        <div className='page-header__notifications'>
          <IconMore />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
};
