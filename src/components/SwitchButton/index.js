import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import './styles.scss';

const SwitchButton = (props) => {
  const { isChecked, onChange } = props;

  const handleToggle = () => {
    onChange(!isChecked);
  };

  const bgClasses = clsx('switch-button', isChecked ? 'selected' : 'default');

  const indicatorClasses = clsx(
    'switch-button__selection-indicator',
    isChecked ? 'selected' : 'default',
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
