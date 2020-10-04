import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconNext from '../../assets/icons/iconNext';
import { textForKey } from '../../utils/localization';

const SettingsMenu = ({ onSelect, currentOption }) => {
  const isSelected = type => {
    return currentOption === type;
  };

  return (
    <div className='settings-menu'>
      <div
        role='button'
        tabIndex={0}
        onClick={() => onSelect('companyDetails')}
        className={clsx(
          'settings-menu-item',
          isSelected('companyDetails') && 'selected',
        )}
      >
        <span className='item-title'>{textForKey('Company details')}</span>
        <div className='next-arrow'>
          {isSelected('companyDetails') && <IconNext />}
        </div>
      </div>
      <div
        role='button'
        tabIndex={0}
        onClick={() => onSelect('workingHours')}
        className={clsx(
          'settings-menu-item',
          isSelected('workingHours') && 'selected',
        )}
      >
        <span className='item-title'>{textForKey('Working hours')}</span>
        <div className='next-arrow'>
          {isSelected('workingHours') && <IconNext />}
        </div>
      </div>
      <div
        role='button'
        tabIndex={0}
        onClick={() => onSelect('accountSettings')}
        className={clsx(
          'settings-menu-item',
          isSelected('accountSettings') && 'selected',
        )}
      >
        <span className='item-title'>{textForKey('Account settings')}</span>
        <div className='next-arrow'>
          {isSelected('accountSettings') && <IconNext />}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;

SettingsMenu.propTypes = {
  onSelect: PropTypes.func,
  currentOption: PropTypes.oneOf(['companyDetails', 'workingHours']),
};
