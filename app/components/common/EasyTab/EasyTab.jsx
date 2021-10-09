import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './EasyTab.module.scss';

const EasyTab = ({ title, selected, highlighted, onClick }) => {
  const tabClass = clsx(
    styles.easyTab,
    selected ? styles.selected : styles.default,
    highlighted && styles.highlighted,
  );
  return (
    <div tabIndex={0} onClick={onClick} className={tabClass}>
      {title}
      <div className={styles.tabIndicator} />
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
