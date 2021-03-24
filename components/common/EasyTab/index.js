import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from '../../../styles/EasyTab.module.scss';

const EasyTab = ({ title, selected, highlighted, onClick }) => {
  const tabClass = clsx(
    styles['easy-tab'],
    selected ? styles.selected : styles.default,
    highlighted && styles.highlighted,
  );
  return (
    <div role='button' tabIndex={0} onClick={onClick} className={tabClass}>
      {title}
      <div className={styles['tab-indicator']} />
    </div>
  );
};

export default EasyTab;

EasyTab.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.bool,
  highlighted: PropTypes.bool,
  onClick: PropTypes.func,
};

EasyTab.defaultProps = {
  onClick: () => null,
};
