import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { textForKey } from 'app/utils/localization';
import styles from './ClientsChart.module.scss';

const ClientsChart = () => {
  return (
    <Grid item xs={6} className={styles.clientsChart}>
      <div className='chartItem'>
        <Typography className='chartTitle'>
          {textForKey('analytics_clients_new_old')}
        </Typography>
        <div className={styles.clientsContainer}>
          <Typography className={styles.counterLabel}>
            359 <span className={styles.divider}>/</span>{' '}
            <span className={styles.debt}>430</span>
          </Typography>
        </div>
      </div>
    </Grid>
  );
};

export default ClientsChart;
