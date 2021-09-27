import React from "react";
import PropTypes from 'prop-types';
import styles from './Hours.module.scss';
import HourItem from "./HourItem";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";

const Hours = ({ hours }) => {
  return (
    <div className={styles.hoursRoot}>
      {hours.map((hour, index) => (
        <HourItem key={`${hour}-${index}`} hour={hour}/>
      ))}
    </div>
  )
}

export default React.memo(Hours, areComponentPropsEqual);

Hours.propTypes = {
  hours: PropTypes.arrayOf(PropTypes.string).isRequired
}
