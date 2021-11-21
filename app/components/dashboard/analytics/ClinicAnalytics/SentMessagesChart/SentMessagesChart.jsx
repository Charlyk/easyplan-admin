import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import formattedNumber from 'app/utils/formattedNumber';
import { textForKey } from 'app/utils/localization';
import styles from './SentMessagesChart.module.scss';

const SentMessagesChart = ({ messages }) => {
  return (
    <Grid item xs={4} className={styles.sentMessagesChart}>
      <div className='chartItem'>
        <Typography className='chartTitle'>
          {textForKey('analytics_total_messages')}
        </Typography>
        <div className={styles.messagesCountContainer}>
          <Typography className={styles.counterLabel}>
            {formattedNumber(messages)}
          </Typography>
        </div>
      </div>
    </Grid>
  );
};

export default SentMessagesChart;

SentMessagesChart.propTypes = {
  messages: PropTypes.number,
};
