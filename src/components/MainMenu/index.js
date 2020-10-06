import React, { useEffect, useRef, useState } from 'react';

import { ClickAwayListener, Fade, Paper, Popper } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import './styles.scss';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import IconArrowDown from '../../assets/icons/iconArrowDown';
import IconPlus from '../../assets/icons/iconPlus';
import IconSuccess from '../../assets/icons/iconSuccess';
import MenuAnalytics from '../../assets/icons/menuAnalytics';
import MenuCalendar from '../../assets/icons/menuCalendar';
import MenuCategories from '../../assets/icons/menuCategories';
import MenuEllipse from '../../assets/icons/menuEllipse';
import MenuPatients from '../../assets/icons/menuPatients';
import MenuSettings from '../../assets/icons/menuSettings';
import MenuUsers from '../../assets/icons/menuUsers';
import { textForKey } from '../../utils/localization';

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
    text: textForKey('Categories'),
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
  {
    id: 'settings',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('Settings'),
    icon: <MenuSettings />,
    href: '/settings',
  },
];

const MainMenu = props => {
  const buttonRef = useRef(null);
  const { currentPath, currentUser, onCreateClinic, onChangeCompany } = props;
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

  const isActive = itemHref => {
    return currentPath.startsWith(itemHref);
  };

  const handleCompanySelected = company => {
    onChangeCompany(company);
    handleCompanyClose();
  };

  const handleCreateClinic = () => {
    onCreateClinic();
    handleCompanyClose();
  };

  const selectedClinic =
    currentUser?.clinics.find(item => item.id === currentUser.selectedClinic) ||
    null;

  const clinicsPopper =
    buttonRef.current != null ? (
      <Popper
        className='companies-popper-root'
        anchorEl={buttonRef}
        disablePortal
        open={isClinicsOpen}
        placement='bottom'
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className='companies-paper'>
              <div className='options-wrapper'>
                {currentUser?.clinics.map(clinic => (
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={() => handleCompanySelected(clinic)}
                    key={clinic.id}
                    className={clsx(
                      'option clinic',
                      selectedClinic?.id === clinic.id && 'selected',
                    )}
                  >
                    {clinic.clinicName} <IconSuccess fill='#3A83DC' />
                  </div>
                ))}
                <div
                  role='button'
                  tabIndex={0}
                  className='option'
                  onClick={handleCreateClinic}
                >
                  <IconPlus fill='#34344E' />
                  {textForKey('Create clinic')}
                </div>
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>
    ) : null;

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
            {selectedClinic?.clinicName || textForKey('Create clinic')}
          </span>
        </ClickAwayListener>
        <IconArrowDown />
        {clinicsPopper}
      </div>

      <Nav defaultActiveKey={currentPath} className='navigation flex-column'>
        {menuItems.map(item => {
          if (!item.roles.includes(selectedClinic?.roleInClinic)) return null;
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
                  {item.children.map(child => {
                    return (
                      <Nav.Item key={child.href}>
                        <Link
                          className={`link-item ${isActive(child.href) &&
                            'active'}`}
                          to={child.href}
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
                  className={`navigation__item link-item ${isActive(
                    item.href,
                  ) && 'active'}`}
                  to={item.href}
                >
                  {item.icon}
                  {item.text}
                </Link>
              </Nav.Item>
            );
          }
        })}
      </Nav>
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
