import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconNext from '../../../../components/icons/iconNext';
import { textForKey } from '../../../../utils/localization';
import styles from './SettingsMenu.module.scss';

const SettingsMenu = ({ onSelect, currentOption, selectedClinic }) => {
  const isSelected = type => {
    return currentOption === type;
  };

  return (
    <div className={styles['settings-menu']}>
      {['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic) && (
        <div
          role='button'
          tabIndex={0}
          onClick={() => onSelect('companyDetails')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('companyDetails') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>{textForKey('Company details')}</span>
          <div className={styles['next-arrow']}>
            {isSelected('companyDetails') && <IconNext />}
          </div>
        </div>
      )}
      {['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic) && (
        <div
          role='button'
          tabIndex={0}
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
        </div>
      )}
      {['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic) && (
        <div
          role='button'
          tabIndex={0}
          onClick={() => onSelect('bracesSettings')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('bracesSettings') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>{textForKey('Braces settings')}</span>
          <div className={styles['next-arrow']}>
            {isSelected('bracesSettings') && <IconNext />}
          </div>
        </div>
      )}
      {['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic) && (
        <div
          role='button'
          tabIndex={0}
          onClick={() => onSelect('workingHours')}
          className={clsx(
            styles['settings-menu-item'],
            isSelected('workingHours') && styles.selected,
          )}
        >
          <span className={styles['item-title']}>{textForKey('Working hours')}</span>
          <div className={styles['next-arrow']}>
            {isSelected('workingHours') && <IconNext />}
          </div>
        </div>
      )}
      <div
        role='button'
        tabIndex={0}
        onClick={() => onSelect('accountSettings')}
        className={clsx(
          styles['settings-menu-item'],
          isSelected('accountSettings') && styles.selected,
        )}
      >
        <span className={styles['item-title']}>{textForKey('Account settings')}</span>
        <div className={styles['next-arrow']}>
          {isSelected('accountSettings') && <IconNext />}
        </div>
      </div>
      <div
        role='button'
        tabIndex={0}
        onClick={() => onSelect('securitySettings')}
        className={clsx(
          styles['settings-menu-item'],
          isSelected('securitySettings') && styles.selected,
        )}
      >
        <span className={styles['item-title']}>{textForKey('Security settings')}</span>
        <div className={styles['next-arrow']}>
          {isSelected('securitySettings') && <IconNext />}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;

SettingsMenu.propTypes = {
  onSelect: PropTypes.func,
  currentOption: PropTypes.oneOf(['companyDetails', 'workingHours']),
  selectedClinic: PropTypes.shape({
    roleInClinic: PropTypes.string,
  }),
};
