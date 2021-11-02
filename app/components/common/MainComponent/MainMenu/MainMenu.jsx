import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import IconMessages from '@material-ui/icons/Message';
import IconLiveHelp from '@material-ui/icons/LiveHelp';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssessmentIcon from '@material-ui/icons/Assessment'
import Collapse from "@material-ui/core/Collapse";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { textForKey } from '../../../../utils/localization';
import { Role, TECH_SUPPORT_URL } from "../../../../utils/constants";
import notifications from "../../../../utils/notifications/notifications";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import wasNotificationShown from "../../../../utils/notifications/wasNotificationShown";
import updateNotificationState from "../../../../utils/notifications/updateNotificationState";
import IconArrowDown from '../../../icons/iconArrowDown';
import MenuAnalytics from '../../../icons/menuAnalytics';
import MenuCalendar from '../../../icons/menuCalendar';
import MenuCategories from '../../../icons/menuCategories';
import MenuEllipse from '../../../icons/menuEllipse';
import MenuPatients from '../../../icons/menuPatients';
import MenuSettings from '../../../icons/menuSettings';
import MenuUsers from '../../../icons/menuUsers';
import ClinicSelector from '../../ClinicSelector';
import EASHelpView from "../../EASHelpView";
import ExchangeRates from "../ExchageRates";
import styles from './MainMenu.module.scss';

const menuItems = [
  {
    id: 'analytics',
    type: 'group',
    text: textForKey('Analytics'),
    icon: <MenuAnalytics/>,
    roles: [Role.admin, Role.manager, Role.reception],
    children: [
      {
        text: textForKey('General'),
        href: '/analytics/general',
        roles: [Role.admin, Role.manager],
      },
      {
        text: textForKey('Services'),
        href: '/analytics/services',
        roles: [Role.admin, Role.manager, Role.reception],
      },
      {
        text: textForKey('Doctors'),
        href: '/analytics/doctors',
        roles: [Role.admin],
      },
      // {
      //   text: textForKey('Activity logs'),
      //   href: '/analytics/activity-logs',
      //   roles: [Role.admin, Role.manager],
      // },
    ],
  },
  {
    id: 'services',
    type: 'link',
    roles: [Role.admin, Role.manager],
    text: textForKey('Services'),
    icon: <MenuCategories/>,
    href: '/services',
  },
  {
    id: 'users',
    type: 'link',
    roles: [Role.admin, Role.manager],
    text: textForKey('Users'),
    icon: <MenuUsers/>,
    href: '/users',
  },
  // {
  //   id: 'crm',
  //   type: 'link',
  //   roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
  //   text: textForKey('CRM Board'),
  //   icon: <AssessmentIcon />,
  //   href: '/crm'
  // },
  {
    id: 'calendar',
    type: 'link',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('Calendar'),
    icon: <MenuCalendar/>,
    href: '/calendar/day',
  },
  {
    id: 'patients',
    type: 'link',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('Patients'),
    icon: <MenuPatients/>,
    href: '/patients',
  },
  {
    id: 'messages',
    type: 'link',
    roles: [Role.admin, Role.manager],
    text: textForKey('Messages'),
    icon: <IconMessages/>,
    href: '/messages',
  },
  {
    id: 'settings',
    type: 'link',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('Settings'),
    icon: <MenuSettings/>,
    href: '/settings',
  },
  {
    id: 'tech_support',
    type: 'button',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('tech_support'),
    icon: <IconLiveHelp/>,
    href: TECH_SUPPORT_URL,
  }
];

const MainMenu = ({ currentPath, currentUser, currentClinic, onCreateClinic }) => {
  const buttonRef = useRef(null);
  const selectedClinic = currentUser?.clinics?.find((item) => item.clinicId === currentClinic.id);
  const canRegisterPayments = selectedClinic?.canRegisterPayments;
  const [techSupportRef, setTechSupportRef] = useState(null);
  const [crmDashboardRef, setCrmDashboardRef] = useState(null);
  const [isClinicsOpen, setIsClinicsOpen] = useState(false);
  const [showTechSupportHelp, setShowTechSupportHelp] = useState(false);
  const [showCrmHelp, setShowCrmHelp] = useState(false);
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(
    currentPath.startsWith('/analytics'),
  );

  useEffect(() => {
    setIsAnalyticsExpanded(checkIsAnalyticsEnabled());
  }, [currentPath]);

  useEffect(() => {
    setShowTechSupportHelp(!wasNotificationShown(notifications.techSupport.id));
  }, []);

  // useEffect(() => {
  //   setShowCrmHelp(
  //     !wasNotificationShown(notifications.menuCRMImplementation.id) &&
  //     !showTechSupportHelp,
  //   );
  // }, [showTechSupportHelp]);

  const handleAnalyticsClick = () => {
    setIsAnalyticsExpanded(!isAnalyticsExpanded);
  };

  const checkIsAnalyticsEnabled = () => {
    return currentPath !== '/' && currentPath.startsWith('/analytics');
  };

  const handleCompanyClick = () => {
    setIsClinicsOpen(!isClinicsOpen);
  };

  const handleCompanyClose = () => {
    setIsClinicsOpen(false);
  };

  const isActive = (itemHref) => {
    return currentPath !== '/' && itemHref.startsWith(currentPath);
  };

  const handleCompanySelected = async (company) => {
    const [_, domain, location] = window.location.host.split('.');
    const { protocol } = window.location;
    const clinicUrl = `${protocol}//${company.clinicDomain}.${domain}.${location}`;
    window.open(clinicUrl, '_blank')
    handleCompanyClose();
  };

  const handleCreateClinic = () => {
    onCreateClinic();
    handleCompanyClose();
  };

  const handleNotificationClose = (notification) => {
    updateNotificationState(notification.id, true);
    if (notification.id === notifications.techSupport.id) {
      setShowTechSupportHelp(false);
    } else if (notification.id === notifications.menuCRMImplementation.id) {
      setShowCrmHelp(false);
    }
  };

  const handleHelpClick = () => {
    window.open('https://m.me/easyplan.pro', '_blank')
  }

  const userClinic = currentUser.clinics.find(
    (item) => item.clinicId === currentClinic.id,
  );

  return (
    <div className={styles.mainMenu}>
      <ClickAwayListener onClickAway={handleCompanyClose}>
        <div
          role='button'
          tabIndex={0}
          ref={buttonRef}
          className={styles.logoContainer}
          onClick={handleCompanyClick}
        >
          <span className={styles.clinicName}>
            {userClinic?.clinicName || textForKey('Create clinic')}
          </span>
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
      </ClickAwayListener>

      <List className={styles.menuList}>
        {menuItems.map((item) => {
          if (!item.roles.includes(userClinic?.roleInClinic)) return null;
          if (item.type === 'group') {
            return (
              <React.Fragment key={item.id}>
                <ListItem
                  classes={{ root: styles.listItem, selected: styles.selected }}
                  onPointerUp={handleAnalyticsClick}
                  selected={checkIsAnalyticsEnabled()}
                >
                  <ListItemIcon className={styles.itemIcon}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    classes={{ primary: styles.itemText }}
                  />
                </ListItem>
                <Collapse in={isAnalyticsExpanded}>
                  <List>
                    {item.children.map((child) => {
                      if (!child.roles.includes(userClinic?.roleInClinic)) return null
                      return (
                        <Link href={child.href} key={child.href}>
                          <ListItem
                            classes={{ root: clsx(styles.listItem, styles.child), selected: styles.selected }}
                            selected={isActive(child.href)}
                          >
                            <ListItemIcon className={clsx(styles.itemIcon, styles.child)}>
                              <MenuEllipse/>
                            </ListItemIcon>
                            <ListItemText
                              primary={child.text}
                              classes={{ primary: clsx(styles.itemText, styles.child) }}
                            />
                          </ListItem>
                        </Link>
                      )
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            )
          } else if (item.type === 'link') {
            return (
              <Link href={item.href} key={item.id}>
                <ListItem
                  ref={item.id === 'crm' ? setCrmDashboardRef : null}
                  classes={{ root: styles.listItem, selected: styles.selected }}
                  selected={isActive(item.href)}
                >
                  <ListItemIcon className={styles.itemIcon}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    classes={{ primary: styles.itemText }}
                  />
                </ListItem>
              </Link>
            )
          } else {
            return (
              <ListItem
                ref={setTechSupportRef}
                key={item.id}
                classes={{ root: styles.listItem, selected: styles.selected }}
                onPointerUp={handleHelpClick}
                selected={isActive(item.href)}
              >
                <ListItemIcon className={styles.itemIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  classes={{ primary: styles.itemText }}
                />
              </ListItem>
            )
          }
        })}
      </List>

      {currentClinic.isImporting && (
        <Box
          className={styles.importDataWrapper}
          position='absolute'
          bottom='4rem'
          left='1rem'
          display='flex'
          alignItems='center'
        >
          <CircularProgress classes={{ root: styles.importProgressBar }}/>
          <Typography classes={{ root: styles.importDataLabel }}>
            {textForKey('Importing data in progress')}
          </Typography>
        </Box>
      )}
      <ExchangeRates
        currentUser={currentUser}
        currentClinic={currentClinic}
        canEdit={canRegisterPayments}
      />
      <EASHelpView
        placement="right"
        onClose={handleNotificationClose}
        notification={notifications.techSupport}
        anchorEl={techSupportRef}
        open={showTechSupportHelp}
      />
      <EASHelpView
        placement="right"
        onClose={handleNotificationClose}
        notification={notifications.menuCRMImplementation}
        anchorEl={crmDashboardRef}
        open={showCrmHelp}
      />
    </div>
  );
};

export default React.memo(MainMenu, areComponentPropsEqual);

MainMenu.propTypes = {
  currentPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  onCreateClinic: PropTypes.func,
  onChangeCompany: PropTypes.func,
};
