import React from "react";
import PropTypes from 'prop-types';
import styles from './Hours.module.scss';

const HourItem = ({ hour }) => {
  return (
    <div className={styles.hourItem}>
      {hour}
    </div>
  )
}

export default HourItem;

HourItem.propTypes = {
  hour: PropTypes.string,
}
