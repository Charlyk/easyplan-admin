import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import './styles.scss';
import { Image, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import dropDownIcon from '../../assets/icons/menu-drop-down.svg';
import MenuAnalytics from '../../assets/icons/menuAnalytics';
import MenuCalendar from '../../assets/icons/menuCalendar';
import MenuCategories from '../../assets/icons/menuCategories';
import MenuEllipse from '../../assets/icons/menuEllipse';
import MenuPatients from '../../assets/icons/menuPatients';
import MenuSettings from '../../assets/icons/menuSettings';
import MenuUsers from '../../assets/icons/menuUsers';
import easyplanLogo from '../../assets/images/easyplan-logo.svg';
import { textForKey } from '../../utils/localization';

const menuItems = [
  {
    id: 'analytics',
    type: 'group',
    text: textForKey('Analytics'),
    icon: <MenuAnalytics />,
    children: [
      {
        text: 'General',
        href: '/analytics/general',
      },
      {
        text: 'Services',
        href: '/analytics/services',
      },
      {
        text: 'Doctors',
        href: '/analytics/doctors',
      },
      {
        text: 'Activity logs',
        href: '/analytics/activity-logs',
      },
    ],
  },
  {
    id: 'categories',
    type: 'link',
    text: textForKey('Categories'),
    icon: <MenuCategories />,
    href: '/categories',
  },
  {
    id: 'users',
    type: 'link',
    text: textForKey('Users'),
    icon: <MenuUsers />,
    href: '/users',
  },
  {
    id: 'calendar',
    type: 'link',
    text: textForKey('Calendar'),
    icon: <MenuCalendar />,
    href: '/calendar',
  },
  {
    id: 'patients',
    type: 'link',
    text: textForKey('Patients'),
    icon: <MenuPatients />,
    href: '/patients',
  },
  {
    id: 'settings',
    type: 'link',
    text: textForKey('Settings'),
    icon: <MenuSettings />,
    href: '/settings',
  },
];

const MainMenu = props => {
  const { currentPath } = props;
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

  const isActive = itemHref => {
    return currentPath.startsWith(itemHref);
  };

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
      <div className='main-menu__logo-container'>
        <Image src={easyplanLogo} className='main-menu__logo' />
        <Image src={dropDownIcon} className='main-menu__drop-down-icon' />
      </div>

      <Nav defaultActiveKey={currentPath} className='navigation flex-column'>
        {menuItems.map(item => {
          if (item.type === 'group') {
            return (
              <Nav.Item key={item.id} as='div' className={analyticsClass}>
                <div
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
};
