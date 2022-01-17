import React from 'react';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './SwitchButton.module.scss';

const SwitchButton = (props) => {
  const { isChecked, onChange, clickable } = props;

  const handleToggle = () => {
    onChange?.(!isChecked);
  };

  const bgClasses = clsx(
    styles['switch-button'],
    isChecked ? styles.selected : styles.default,
    !clickable && styles.controlled,
  );

  const indicatorClasses = clsx(
    styles['switch-button__selection-indicator'],
    isChecked ? styles.selected : styles.default,
  );

  return (
    <Box
      role='button'
      tabIndex={0}
      className={bgClasses}
      onClick={handleToggle}
    >
      <div className={indicatorClasses} />
    </Box>
  );
};

export default SwitchButton;

SwitchButton.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  clickable: PropTypes.bool,
  onChange: PropTypes.func,
};

SwitchButton.defaultProps = {
  clickable: true,
};
