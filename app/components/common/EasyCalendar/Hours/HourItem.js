import React from "react";
import PropTypes from 'prop-types';
import styles from './Hours.module.scss';
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";

const HourItem = ({ hour }) => {
  return (
    <div className={styles.hourItem}>
      {hour}
    </div>
  )
}

export default React.memo(HourItem, areComponentPropsEqual);

HourItem.propTypes = {
  hour: PropTypes.string,
}
