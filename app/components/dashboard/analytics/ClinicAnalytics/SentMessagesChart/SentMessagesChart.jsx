import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import IconClose from 'app/components/icons/iconClose';
import formattedNumber from 'app/utils/formattedNumber';
import { textForKey } from 'app/utils/localization';
import { ChartType } from 'types/ChartType.type';
import styles from './SentMessagesChart.module.scss';

const SentMessagesChart = ({ messages, onClose, visible = true }) => {
  if (!visible || messages == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.Messages);
  };

  return (
    <Grid item xs={4} className={styles.sentMessagesChart}>
      <div className='chartItem'>
        <div className='buttonContainer'>
          <IconButton onClick={handleClose}>
            <IconClose />
          </IconButton>
        </div>
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
  visible: PropTypes.bool,
  messages: PropTypes.number,
};
