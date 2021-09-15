import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from '../../../styles/SwitchButton.module.scss';

const SwitchButton = (props) => {
  const { isChecked, onChange } = props;

  const handleToggle = () => {
    onChange(!isChecked);
  };

  const bgClasses = clsx(styles['switch-button'], isChecked ? styles.selected : styles.default);

  const indicatorClasses = clsx(
    styles['switch-button__selection-indicator'],
    isChecked ? styles.selected : styles.default,
  );

  return (
    <div
      role='button'
      tabIndex={0}
      className={bgClasses}
      onClick={handleToggle}
    >
      <div className={indicatorClasses} />
    </div>
  );
};

export default SwitchButton;

SwitchButton.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};
