import React, { useRef, useState } from 'react';

import './styles.scss';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconAvatar from '../../assets/icons/iconAvatar';
import IconMore from '../../assets/icons/iconMore';
import IconNotifications from '../../assets/icons/iconNotifications';
import IconTurnOff from '../../assets/icons/iconTurnOff';
import { userSelector } from '../../redux/selectors/rootSelector';
import { textForKey } from '../../utils/localization';
import ActionsSheet from '../ActionsSheet';

const actions = [
  {
    name: textForKey('Logout'),
    key: 'log-out',
    icon: <IconTurnOff />,
    type: 'destructive',
  },
];

const PageHeader = props => {
  const actionsAnchor = useRef(null);
  const user = useSelector(userSelector);
  const { title, onLogout } = props;
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
        placement='bottom-end'
      />
      <div className='page-header__title'>{title}</div>
      <div className='page-header__actions'>
        <div className='page-header__notifications'>
          <IconNotifications />
        </div>
        <div className='avatar-container'>
          {user?.avatar ? (
            <Image roundedCircle className='avatar-image' src={user.avatar} />
          ) : (
            <IconAvatar />
          )}
        </div>
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
  user: PropTypes.shape({
    id: PropTypes.string,
    avatar: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
  }),
  onSearch: PropTypes.func,
  onLogout: PropTypes.func,
};

PageHeader.defaultProps = {
  onLogout: () => null,
};
