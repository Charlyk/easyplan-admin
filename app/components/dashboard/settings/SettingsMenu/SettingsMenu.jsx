import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import IconNext from 'app/components/icons/iconNext';
import { Role } from 'app/utils/constants';
import { AppLanguages } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { setAppLanguage } from 'app/utils/localization';
import { dispatchUpdateUserLanguage } from 'redux/slices/appDataSlice';
import styles from './SettingsMenu.module.scss';

const SettingsMenu = ({ onSelect, currentOption, selectedClinic }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isSelected = (type) => {
    return currentOption === type;
  };

  const handleLanguageButtonClick = (key) => {
    setAppLanguage(key);
    dispatch(dispatchUpdateUserLanguage(key));
    // router.reload();
  };

  return (
    <div className={styles['settings-menu']}>
      {[Role.admin, Role.manager].includes(selectedClinic?.roleInClinic) && (
        <Box
          onClick={() => onSelect('companyDetails')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('companyDetails') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>
            {textForKey('Company details')}
          </span>
          <div className={styles['next-arrow']}>
            {isSelected('companyDetails') && <IconNext />}
          </div>
        </Box>
      )}
      {[Role.admin, Role.manager].includes(selectedClinic?.roleInClinic) && (
        <Box
          onClick={() => onSelect('appSettings')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('appSettings') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>
            {textForKey('Application settings')}
          </span>
          <div className={styles['next-arrow']}>
            {isSelected('appSettings') && <IconNext />}
          </div>
        </Box>
      )}
      {[Role.admin, Role.manager].includes(selectedClinic?.roleInClinic) && (
        <Box
          onClick={() => onSelect('crmSettings')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('crmSettings') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>
            {textForKey('crm_settings')}
          </span>
          <div className={styles['next-arrow']}>
            {isSelected('crmSettings') && <IconNext />}
          </div>
        </Box>
      )}
      {[Role.admin, Role.manager].includes(selectedClinic?.roleInClinic) && (
        <Box
          onClick={() => onSelect('bracesSettings')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('bracesSettings') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>
            {textForKey('Braces settings')}
          </span>
          <div className={styles['next-arrow']}>
            {isSelected('bracesSettings') && <IconNext />}
          </div>
        </Box>
      )}
      {[Role.admin, Role.manager].includes(selectedClinic?.roleInClinic) && (
        <Box
          onClick={() => onSelect('workingHours')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('workingHours') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>
            {textForKey('Working hours')}
          </span>
          <div className={styles['next-arrow']}>
            {isSelected('workingHours') && <IconNext />}
          </div>
        </Box>
      )}
      <Box
        onClick={() => onSelect('accountSettings')}
        className={clsx(
          styles['settings-menu-item'],
          isSelected('accountSettings') && styles.selected,
        )}
      >
        <span className={styles['item-title']}>
          {textForKey('Account settings')}
        </span>
        <div className={styles['next-arrow']}>
          {isSelected('accountSettings') && <IconNext />}
        </div>
      </Box>
      <Box
        onClick={() => onSelect('securitySettings')}
        className={clsx(
          styles['settings-menu-item'],
          isSelected('securitySettings') && styles.selected,
        )}
      >
        <span className={styles['item-title']}>
          {textForKey('Security settings')}
        </span>
        <div className={styles['next-arrow']}>
          {isSelected('securitySettings') && <IconNext />}
        </div>
      </Box>
      <Box className={clsx(styles['settings-menu-item'])}>
        {AppLanguages.map((key) => (
          <Button
            id={key}
            key={key}
            onClick={() => handleLanguageButtonClick(key)}
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
