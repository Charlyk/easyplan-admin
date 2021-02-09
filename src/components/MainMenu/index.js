import React, { useEffect, useRef, useState } from 'react';

import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Typography,
} from '@material-ui/core';
import IconMessages from '@material-ui/icons/Message';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import './styles.scss';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import IconArrowDown from '../../assets/icons/iconArrowDown';
import MenuAnalytics from '../../assets/icons/menuAnalytics';
import MenuCalendar from '../../assets/icons/menuCalendar';
import MenuCategories from '../../assets/icons/menuCategories';
import MenuEllipse from '../../assets/icons/menuEllipse';
import MenuPatients from '../../assets/icons/menuPatients';
import MenuSettings from '../../assets/icons/menuSettings';
import MenuUsers from '../../assets/icons/menuUsers';
import trustSeal from '../../assets/images/positivessl_trust_seal.png';
import { clinicDetailsSelector } from '../../redux/selectors/clinicSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import { updateLink } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import sessionManager from '../../utils/settings/sessionManager';
import ClinicSelector from '../ClinicSelector';

const menuItems = [
  {
    id: 'analytics',
    type: 'group',
    text: textForKey('Analytics'),
    icon: <MenuAnalytics />,
    roles: ['ADMIN', 'MANAGER'],
    children: [
      {
        text: textForKey('General'),
        href: '/analytics/general',
      },
      {
        text: textForKey('Services'),
        href: '/analytics/services',
      },
      {
        text: textForKey('Doctors'),
        href: '/analytics/doctors',
      },
      {
        text: textForKey('Activity logs'),
        href: '/analytics/activity-logs',
      },
    ],
  },
  {
    id: 'categories',
    type: 'link',
    roles: ['ADMIN', 'MANAGER'],
    text: textForKey('Services'),
    icon: <MenuCategories />,
    href: '/categories',
  },
  {
    id: 'users',
    type: 'link',
    roles: ['ADMIN', 'MANAGER'],
    text: textForKey('Users'),
    icon: <MenuUsers />,
    href: '/users',
  },
  {
    id: 'calendar',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('Calendar'),
    icon: <MenuCalendar />,
    href: '/calendar',
  },
  {
    id: 'patients',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('Patients'),
    icon: <MenuPatients />,
    href: '/patients',
  },
  // {
  //   id: 'messages',
  //   type: 'link',
  //   roles: ['ADMIN', 'MANAGER'],
  //   text: textForKey('Messages'),
  //   icon: <IconMessages />,
  //   href: '/messages',
  // },
  {
    id: 'settings',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('Settings'),
    icon: <MenuSettings />,
    href: '/settings',
  },
];

const MainMenu = (props) => {
  const buttonRef = useRef(null);
  const clinic = useSelector(clinicDetailsSelector);
  const currentUser = useSelector(userSelector);
  const { currentPath, onCreateClinic, onChangeCompany } = props;
  const [isClinicsOpen, setIsClinicsOpen] = useState(false);
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(
    currentPath.startsWith('/analytics'),
  );

  useEffect(() => {
    setIsAnalyticsExpanded(isAnalyticsEnabled());
  }, [currentPath]);

  const handleAnalyticsClick = () => {
    setIsAnalyticsExpanded(!isAnalyticsExpanded);
  };

  const isAnalyticsEnabled = () => {
    return currentPath.startsWith('/analytics');
  };

  const handleCompanyClick = () => {
    setIsClinicsOpen(!isClinicsOpen);
  };

  const handleCompanyClose = () => {
    setIsClinicsOpen(false);
  };

  const isActive = (itemHref) => {
    return currentPath.startsWith(itemHref);
  };

  const handleCompanySelected = (company) => {
    onChangeCompany(company);
    handleCompanyClose();
  };

  const handleCreateClinic = () => {
    onCreateClinic();
    handleCompanyClose();
  };

  const userClinic = currentUser.clinics.find(
    (item) => item.clinicId === sessionManager.getSelectedClinicId(),
  );

  const analyticsClass = clsx(
    'navigation__item div-item',
    isAnalyticsEnabled() && 'active',
  );

  const analyticsChildClass = clsx(
    'child-container',
    isAnalyticsExpanded && 'expanded',
  );

  return (
    <div className='main-menu'>
      <div
        role='button'
        tabIndex={0}
        ref={buttonRef}
        className='main-menu__logo-container'
        onClick={handleCompanyClick}
      >
        <ClickAwayListener onClickAway={handleCompanyClose}>
          <span className='clinic-name'>
            {userClinic?.clinicName || textForKey('Create clinic')}
          </span>
        </ClickAwayListener>
        <IconArrowDown />
        <ClinicSelector
          anchorEl={buttonRef}
          onClose={handleCompanyClose}
          open={isClinicsOpen}
          onChange={handleCompanySelected}
          onCreate={handleCreateClinic}
        />
      </div>

      <Nav defaultActiveKey={currentPath} className='navigation flex-column'>
        {menuItems.map((item) => {
          if (!item.roles.includes(userClinic?.roleInClinic)) return null;
          if (item.type === 'group') {
            return (
              <Nav.Item key={item.id} as='div' className={analyticsClass}>
                <div
                  tabIndex={0}
                  className='title-container'
                  role='button'
                  onClick={handleAnalyticsClick}
                >
                  {item.icon}
                  {item.text}
                </div>
                <div className={analyticsChildClass}>
                  {item.children.map((child) => {
                    return (
                      <Nav.Item key={child.href}>
                        <Link
                          className={`link-item ${
                            isActive(child.href) && 'active'
                          }`}
                          to={updateLink(child.href)}
                        >
                          <MenuEllipse />
                          {child.text}
                        </Link>
                      </Nav.Item>
                    );
                  })}
                </div>
              </Nav.Item>
            );
          } else {
            return (
              <Nav.Item key={item.id}>
                <Link
                  className={`navigation__item link-item ${
                    isActive(item.href) && 'active'
                  }`}
                  to={updateLink(item.href)}
                >
                  {item.icon}
                  {item.text}
                </Link>
              </Nav.Item>
            );
          }
        })}
      </Nav>
      {clinic.isImporting && (
        <Box
          className='import-data-wrapper'
          position='absolute'
          bottom='4rem'
          left='1rem'
          display='flex'
          alignItems='center'
        >
          <CircularProgress classes={{ root: 'import-progress-bar' }} />
          <Typography classes={{ root: 'import-data-label' }}>
            {textForKey('Importing data in progress')}
          </Typography>
        </Box>
      )}
      <img className='trust-seal-image' src={trustSeal} alt='SSL Trust Seal' />
    </div>
  );
};

export default MainMenu;

MainMenu.propTypes = {
  currentPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  onCreateClinic: PropTypes.func,
  onChangeCompany: PropTypes.func,
};
