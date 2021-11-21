import React from 'react';
import PropTypes from 'prop-types';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import styles from './Hours.module.scss';

const HourItem = ({ hour }) => {
  return <div className={styles.hourItem}>{hour}</div>;
};

export default React.memo(HourItem, areComponentPropsEqual);

HourItem.propTypes = {
  hour: PropTypes.string,
};
