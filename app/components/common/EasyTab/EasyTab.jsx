import React from 'react';
import Box from '@material-ui/core/Box';
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
    <Box onClick={onClick} className={tabClass}>
      {title}
      <div className={styles.tabIndicator} />
    </Box>
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
