import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import IconNext from 'app/components/icons/iconNext';
import { Role } from 'app/utils/constants';
import { AppLanguages } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { setAppLanguage } from 'app/utils/localization';
import { appLanguageSelector } from 'redux/selectors/appDataSelector';
import { dispatchUpdateUserLanguage } from 'redux/slices/appDataSlice';
import styles from './SettingsMenu.module.scss';
const managersMenuItems = [
  { name: 'Company Details', url: 'company-details' },
  { name: 'Application settings', url: 'app-settings' },
  { name: 'crm_settings', url: 'crm-settings' },
  { name: 'Braces settings', url: 'braces-settings' },
  { name: 'Working hours', url: 'working-hours' },
  { name: 'billing_details', url: 'billing-details' },
];

const generalMenuItems = [
  { name: 'Account settings', url: 'account-settings' },
  { name: 'Security settings', url: 'security-settings' },
];

const SettingsMenu = ({ onSelect, currentOption, selectedClinic }) => {
  const dispatch = useDispatch();
  const appLanguage = useSelector(appLanguageSelector);
  const isSelected = (type) => {
    return currentOption === type;
  };

  const handleLanguageButtonClick = (key) => {
    setAppLanguage(key);
    dispatch(dispatchUpdateUserLanguage(key));
  };

  return (
    <div className={styles['settings-menu']}>
      {[
        ...([Role.admin, Role.manager].includes(selectedClinic?.roleInClinic)
          ? managersMenuItems
          : []),
        ...generalMenuItems,
      ].map((menuItem) => {
        const isActive = isSelected(menuItem.url);
        return (
          <Box
            key={menuItem.url}
            onClick={() => onSelect(menuItem.url)}
            className={clsx(styles['settings-menu-item'], {
              [styles.selected]: isActive,
            })}
          >
            <span className={styles['item-title']}>
              {textForKey(menuItem.name)}
            </span>
            <div className={styles['next-arrow']}>
              {isActive && <IconNext />}
            </div>
          </Box>
        );
      })}
      <Box className={clsx(styles['settings-menu-item'])}>
        {AppLanguages.map((key) => (
          <Button
            id={key}
            key={key}
            onClick={() => handleLanguageButtonClick(key)}
            className={clsx({ [styles.activeBtn]: key === appLanguage })}
          >
            {key}
          </Button>
        ))}
      </Box>
    </div>
  );
};

export default SettingsMenu;

SettingsMenu.propTypes = {
  onSelect: PropTypes.func,
  currentOption: PropTypes.oneOf([
    'companyDetails',
    'workingHours',
    'appSettings',
    'securitySettings',
    'accountSettings',
    'bracesSettings',
    'crmSettings',
  ]),
  selectedClinic: PropTypes.shape({
    roleInClinic: PropTypes.string,
  }),
};
