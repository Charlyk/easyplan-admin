import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styles from './HeaderItem.module.scss';

const HeaderItem = ({ date }) => {
  return (
    <div className={styles.headerItem}>
      <Typography className={styles.dateLabel}>
        {moment(date).format('DD MMM YYYY')}
      </Typography>
      <Divider className={styles.divider} />
    </div>
  );
};

export default HeaderItem;

HeaderItem.propTypes = {
  date: PropTypes.any,
};
