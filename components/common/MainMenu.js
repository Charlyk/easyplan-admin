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
import styles from '../../styles/MainMenu.module.scss';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import IconArrowDown from '../icons/iconArrowDown';
import MenuAnalytics from '../icons/menuAnalytics';
import MenuCalendar from '../icons/menuCalendar';
import MenuCategories from '../icons/menuCategories';
import MenuEllipse from '../icons/menuEllipse';
import MenuPatients from '../icons/menuPatients';
import MenuSettings from '../icons/menuSettings';
import MenuUsers from '../icons/menuUsers';
import { clinicDetailsSelector } from '../../redux/selectors/clinicSelector';
import { updateLink } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import ClinicSelector from './ClinicSelector';

const menuItems = [
  {
    id: 'analytics',
    type: 'group',
    text: textForKey('Analytics'),
    icon: <MenuAnalytics/>,
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
    id: 'services',
    type: 'link',
    roles: ['ADMIN', 'MANAGER'],
    text: textForKey('Services'),
    icon: <MenuCategories/>,
    href: '/services',
  },
  {
    id: 'users',
    type: 'link',
    roles: ['ADMIN', 'MANAGER'],
    text: textForKey('Users'),
    icon: <MenuUsers/>,
    href: '/users',
  },
  {
    id: 'calendar',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('Calendar'),
    icon: <MenuCalendar/>,
    href: '/calendar/day',
  },
  {
    id: 'patients',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('Patients'),
    icon: <MenuPatients/>,
    href: '/patients',
  },
  {
    id: 'messages',
    type: 'link',
    roles: ['ADMIN', 'MANAGER'],
    text: textForKey('Messages'),
    icon: <IconMessages/>,
    href: '/messages',
  },
  {
    id: 'settings',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('Settings'),
    icon: <MenuSettings/>,
    href: '/settings',
  },
];

const MainMenu = ({ currentPath, currentUser, currentClinic, onCreateClinic, onChangeCompany }) => {
  const buttonRef = useRef(null);
  const clinic = useSelector(clinicDetailsSelector);
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
    return itemHref.startsWith(currentPath);
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
    (item) => item.clinicId === currentClinic.id,
  );

  const analyticsClass = clsx(
    styles['navigation__item'],
    styles['div-item'],
    isAnalyticsEnabled() && styles.active,
  );

  const analyticsChildClass = clsx(
    styles['child-container'],
    isAnalyticsExpanded && styles.expanded,
  );

  return (
    <div className={styles['main-menu']}>
      <div
        role='button'
        tabIndex={0}
        ref={buttonRef}
        className={styles['main-menu__logo-container']}
        onClick={handleCompanyClick}
      >
        <ClickAwayListener onClickAway={handleCompanyClose}>
          <span className={styles['clinic-name']}>
            {userClinic?.clinicName || textForKey('Create clinic')}
          </span>
        </ClickAwayListener>
        <IconArrowDown/>
        <ClinicSelector
          currentUser={currentUser}
          anchorEl={buttonRef}
          onClose={handleCompanyClose}
          open={isClinicsOpen}
          onChange={handleCompanySelected}
          onCreate={handleCreateClinic}
        />
      </div>

      <Nav defaultActiveKey={currentPath} className={clsx(styles.navigation, 'flex-column')}>
        {menuItems.map((item) => {
          if (!item.roles.includes(userClinic?.roleInClinic)) return null;
          if (item.type === 'group') {
            return (
              <Nav.Item key={item.id} as='div' className={analyticsClass}>
                <div
                  tabIndex={0}
                  className={styles['title-container']}
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
                        <Link href={child.href}>
                          <a
                            className={clsx(styles['link-item'], {
                              [styles.active]: isActive(child.href)
                            })}
                          >
                            <MenuEllipse/>
                            {child.text}
                          </a>
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
                <Link href={item.href}>
                  <a
                    className={clsx(styles['navigation__item'], styles['link-item'], isActive(item.href) && styles.active)}>
                    {item.icon}
                    {item.text}
                  </a>
                </Link>
              </Nav.Item>
            );
          }
        })}
      </Nav>
      {clinic.isImporting && (
        <Box
          className={styles['import-data-wrapper']}
          position='absolute'
          bottom='4rem'
          left='1rem'
          display='flex'
          alignItems='center'
        >
          <CircularProgress classes={{ root: styles['import-progress-bar'] }}/>
          <Typography classes={{ root: styles['import-data-label'] }}>
            {textForKey('Importing data in progress')}
          </Typography>
        </Box>
      )}
      <img
        className={styles['trust-seal-image']}
        src='/positivessl_trust_seal.png'
        alt='SSL Trust Seal'
      />
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
