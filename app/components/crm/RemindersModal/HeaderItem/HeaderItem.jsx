import React from "react";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import styles from './HeaderItem.module.scss';

const HeaderItem = ({ date }) => {
  return (
    <div className={styles.headerItem}>
      <Typography className={styles.dateLabel}>{moment(date).format('DD MMM YYYY')}</Typography>
      <Divider className={styles.divider} />
    </div>
  );
};

export default HeaderItem;

HeaderItem.propTypes = {
  date: PropTypes.any
}
