import React, { useRef, useState } from 'react';

import './styles.scss';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

import IconEdit from '../../assets/icons/iconEdit';
import IconMore from '../../assets/icons/iconMore';
import IconNotifications from '../../assets/icons/iconNotifications';
import profileImage from '../../assets/images/profile-image.jpg';
import { textForKey } from '../../utils/localization';
import ActionsSheet from '../ActionsSheet';

const actions = [
  {
    name: textForKey('Edit profile'),
    key: 'edit-profile',
    icon: <IconEdit />,
    type: 'default',
  },
  {
    name: textForKey('Log out'),
    key: 'log-out',
    icon: <IconEdit />,
    type: 'default',
  },
];

const PageHeader = props => {
  const actionsAnchor = useRef(null);
  const { title, onSearch, onLogout } = props;
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const handleActionsClose = () => setIsActionsOpen(false);

  const handleActionsOpen = () => setIsActionsOpen(true);

  const handleActionSelected = action => {
    switch (action.key) {
      case 'log-out':
        onLogout();
        break;
    }
  };

  return (
    <div className='page-header'>
      <ActionsSheet
        onClose={handleActionsClose}
        onSelect={handleActionSelected}
        open={isActionsOpen}
        actions={actions}
        anchorEl={actionsAnchor.current}
      />
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
        <div
          role='button'
          tabIndex={0}
          onClick={handleActionsOpen}
          className='page-header__notifications'
          ref={actionsAnchor}
        >
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
  onLogout: PropTypes.func,
};

PageHeader.defaultProps = {
  onLogout: () => null,
};
