import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import AssessmentIcon from '@material-ui/icons/Assessment';
import IconLiveHelp from '@material-ui/icons/LiveHelp';
import IconMessages from '@material-ui/icons/Message';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ClinicSelector from 'app/components/common/ClinicSelector';
import EASHelpView from 'app/components/common/EASHelpView';
import IconArrowDown from 'app/components/icons/iconArrowDown';
import MenuAnalytics from 'app/components/icons/menuAnalytics';
import MenuCalendar from 'app/components/icons/menuCalendar';
import MenuCategories from 'app/components/icons/menuCategories';
import MenuEllipse from 'app/components/icons/menuEllipse';
import MenuPatients from 'app/components/icons/menuPatients';
import MenuSettings from 'app/components/icons/menuSettings';
import MenuUsers from 'app/components/icons/menuUsers';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { Role, TECH_SUPPORT_URL } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import notifications from 'app/utils/notifications/notifications';
import updateNotificationState from 'app/utils/notifications/updateNotificationState';
import wasNotificationShown from 'app/utils/notifications/wasNotificationShown';
import useRootDomain from 'app/utils/useRootDomain';
import { environment } from 'eas.config';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import { remindersCountSelector } from 'redux/selectors/crmBoardSelector';
import {
  newReminderSelector,
  updatedReminderSelector,
} from 'redux/selectors/crmSelector';
import { dispatchFetchRemindersCount } from 'redux/slices/crmBoardSlice';
import ExchangeRates from '../ExchageRates';
import styles from './MainMenu.module.scss';

const menuItems = [
  {
    id: 'analytics',
    type: 'group',
    text: textForKey('Analytics'),
    icon: <MenuAnalytics />,
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
    icon: <MenuCategories />,
    href: '/services',
    hasCounter: false,
  },
  {
    id: 'users',
    type: 'link',
    roles: [Role.admin, Role.manager],
    text: textForKey('Users'),
    icon: <MenuUsers />,
    href: '/users',
    hasCounter: false,
  },
  {
    id: 'crm',
    type: 'link',
    roles: ['ADMIN', 'MANAGER', 'RECEPTION'],
    text: textForKey('CRM Board'),
    icon: <AssessmentIcon />,
    href: '/crm',
    hasCounter: true,
  },
  {
    id: 'calendar',
    type: 'link',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('Calendar'),
    icon: <MenuCalendar />,
    href: '/calendar/day',
    hasCounter: false,
  },
  {
    id: 'patients',
    type: 'link',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('Patients'),
    icon: <MenuPatients />,
    href: '/patients',
    hasCounter: false,
  },
  {
    id: 'messages',
    type: 'link',
    roles: [Role.admin, Role.manager],
    text: textForKey('Messages'),
    icon: <IconMessages />,
    href: '/messages',
    hasCounter: false,
  },
  {
    id: 'settings',
    type: 'link',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('Settings'),
    icon: <MenuSettings />,
    href: '/settings',
    hasCounter: false,
  },
  {
    id: 'tech_support',
    type: 'button',
    roles: [Role.admin, Role.manager, Role.reception],
    text: textForKey('tech_support'),
    icon: <IconLiveHelp />,
    href: TECH_SUPPORT_URL,
    hasCounter: false,
  },
];

const MainMenu = ({ currentPath, onCreateClinic }) => {
  const router = useRouter();
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  const selectedClinic = useSelector(userClinicSelector);
  const currentUser = useSelector(currentUserSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const canRegisterPayments = selectedClinic?.canRegisterPayments;
  const remoteReminder = useSelector(newReminderSelector);
  const updatedReminder = useSelector(updatedReminderSelector);
  const remindersCount = useSelector(remindersCountSelector);
  const [_rootDomain, getClinicUrl] = useRootDomain();
  const [techSupportRef, setTechSupportRef] = useState(null);
  const [crmDashboardRef, setCrmDashboardRef] = useState(null);
  const [isClinicsOpen, setIsClinicsOpen] = useState(false);
  const [showTechSupportHelp, setShowTechSupportHelp] = useState(false);
  const [showCrmHelp, setShowCrmHelp] = useState(false);
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(
    currentPath.startsWith('/analytics'),
  );
  const canShowCrm =
    environment !== 'production' ||
    currentClinic.id === 1772 ||
    currentClinic.id === 46 ||
    currentClinic.id === 289747;

  useEffect(() => {
    setIsAnalyticsExpanded(checkIsAnalyticsEnabled());
  }, [currentPath]);

  useEffect(() => {
    setShowTechSupportHelp(!wasNotificationShown(notifications.techSupport.id));
  }, []);

  useEffect(() => {
    if (!canShowCrm) {
      return;
    }
    setShowCrmHelp(
      !wasNotificationShown(notifications.menuCRMImplementation.id) &&
        !showTechSupportHelp,
    );
  }, [showTechSupportHelp, canShowCrm]);

  useEffect(() => {
    dispatch(dispatchFetchRemindersCount());
  }, [remoteReminder, updatedReminder]);

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

  const getCounterValue = (item) => {
    switch (item.id) {
      case 'crm':
        return remindersCount;
      default:
        return 0;
    }
  };

  const handleCompanySelected = async (company) => {
    const { clinicDomain } = company;
    const domain = getClinicUrl(clinicDomain);
    const clinicUrl = `${domain}/redirect?token=${authToken}&clinicId=${company.clinicId}`;
    // open clinic a new tab
    window.open(clinicUrl, '_blank');
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
    window.open(TECH_SUPPORT_URL, '_blank');
  };

  const userClinic = currentUser.clinics.find(
    (item) => item.clinicId === currentClinic.id,
  );

  const navigateIfNotAlreadyActive = (path) => {
    if (currentPath === path) return;
    router.push(path);
  };

  return (
    <div className={styles.mainMenu}>
      <ClickAwayListener onClickAway={handleCompanyClose}>
        <Box
          ref={buttonRef}
          className={styles.logoContainer}
          onClick={handleCompanyClick}
        >
          <Typography className={styles.clinicName} noWrap>
            {userClinic?.clinicName || textForKey('Create clinic')}
          </Typography>
          <IconArrowDown />
          <ClinicSelector
            currentUser={currentUser}
            anchorEl={buttonRef}
            onClose={handleCompanyClose}
            open={isClinicsOpen}
            onChange={handleCompanySelected}
            onCreate={handleCreateClinic}
          />
        </Box>
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
                      if (!child.roles.includes(userClinic?.roleInClinic))
                        return null;
                      return (
                        <Link passHref href={child.href} key={child.href}>
                          <ListItem
                            classes={{
                              root: clsx(styles.listItem, styles.child),
                              selected: styles.selected,
                            }}
                            selected={isActive(child.href)}
                          >
                            <ListItemIcon
                              className={clsx(styles.itemIcon, styles.child)}
                            >
                              <MenuEllipse />
                            </ListItemIcon>
                            <ListItemText
                              primary={child.text}
                              classes={{
                                primary: clsx(styles.itemText, styles.child),
                              }}
                            />
                          </ListItem>
                        </Link>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          } else if (item.type === 'link') {
            if (item.id === 'crm') {
              if (!canShowCrm) return null;
              return (
                <a key={item.id}>
                  <ListItem
                    ref={setCrmDashboardRef}
                    classes={{
                      root: styles.listItem,
                      selected: styles.selected,
                    }}
                    selected={isActive(item.href)}
                    onClick={() => navigateIfNotAlreadyActive(item.href)}
                  >
                    <ListItemIcon className={styles.itemIcon}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: styles.itemText }}
                      primary={
                        <Typography className={styles.itemText}>
                          {item.text}
                          {item.hasCounter && getCounterValue(item) > 0 && (
                            <span className={styles.counterLabel}>
                              {getCounterValue(item)}
                            </span>
                          )}
                        </Typography>
                      }
                    />
                  </ListItem>
                </a>
              );
            }
            return (
              <Link passHref href={item.href} key={item.id}>
                <ListItem
                  classes={{ root: styles.listItem, selected: styles.selected }}
                  selected={isActive(item.href)}
                >
                  <ListItemIcon className={styles.itemIcon}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: styles.itemText }}
                    primary={
                      <Typography className={styles.itemText}>
                        {item.text}
                        {item.hasCounter && getCounterValue(item) > 0 && (
                          <span className={styles.counterLabel}>
                            {getCounterValue(item)}
                          </span>
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
              </Link>
            );
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
            );
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
          <CircularProgress classes={{ root: styles.importProgressBar }} />
          <Typography classes={{ root: styles.importDataLabel }}>
            {textForKey('Importing data in progress')}
          </Typography>
        </Box>
      )}
      <ExchangeRates canEdit={canRegisterPayments} />
      <EASHelpView
        placement='right'
        onClose={handleNotificationClose}
        notification={notifications.techSupport}
        anchorEl={techSupportRef}
        open={showTechSupportHelp}
      />
      <EASHelpView
        placement='right'
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
