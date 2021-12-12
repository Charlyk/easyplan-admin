import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import IconClose from 'app/components/icons/iconClose';
import formattedNumber from 'app/utils/formattedNumber';
import { textForKey } from 'app/utils/localization';
import { ChartType } from 'types/ChartType.type';
import styles from './TotalVisitsChart.module.scss';

const TotalVisitsChart = ({ visits, removeable, onClose, visible = true }) => {
  if (!visible || visits == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.Visits);
  };

  return (
    <Grid item xs={4} className={styles.totalVisitsChart}>
      <div className='chartItem'>
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
        <Typography className='chartTitle'>
          {textForKey('analytics_total_visits')}
        </Typography>
        <div className={styles.visitsCountContainer}>
          <Typography className={styles.counterLabel}>
            {formattedNumber(visits || 0)}
          </Typography>
        </div>
      </div>
    </Grid>
  );
};

export default TotalVisitsChart;

TotalVisitsChart.propTypes = {
  visible: PropTypes.bool,
  visits: PropTypes.number,
  removeable: PropTypes.bool,
};
