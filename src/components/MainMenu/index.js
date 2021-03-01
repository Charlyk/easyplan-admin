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
import styles from './MainMenu.module.scss';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import IconArrowDown from '../../assets/icons/iconArrowDown';
import MenuAnalytics from '../../assets/icons/menuAnalytics';
import MenuCalendar from '../../assets/icons/menuCalendar';
import MenuCategories from '../../assets/icons/menuCategories';
import MenuEllipse from '../../assets/icons/menuEllipse';
import MenuPatients from '../../assets/icons/menuPatients';
import MenuSettings from '../../assets/icons/menuSettings';
import MenuUsers from '../../assets/icons/menuUsers';
import { clinicDetailsSelector } from '../../redux/selectors/clinicSelector';
import { updateLink } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import ClinicSelector from '../ClinicSelector';

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
    id: 'categories',
    type: 'link',
    roles: ['ADMIN', 'MANAGER'],
    text: textForKey('Services'),
    icon: <MenuCategories/>,
    href: '/categories',
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
    href: '/calendar',
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

const MainMenu = ({ currentPath, currentUser, selectedClinicId, onCreateClinic, onChangeCompany }) => {
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
    (item) => item.clinicId === selectedClinicId,
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
                        <Link href={updateLink(child.href)}>
                          <div className={clsx(styles['link-item'], isActive(child.href) && styles.active)}>
                            <MenuEllipse/>
                            {child.text}
                          </div>
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
                <Link href={updateLink(item.href)}>
                  <div className={clsx(styles['navigation__item'], styles['link-item'], isActive(item.href) && styles.active)}>
                    {item.icon}
                    {item.text}
                  </div>
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
