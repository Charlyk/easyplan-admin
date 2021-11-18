import React from "react";
import Grid from "@material-ui/core/Grid";
import styles from './ClientsChart.module.scss';
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";

const ClientsChart = () => {
  return (
    <Grid item xs={6} className={styles.clientsChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          {textForKey('analytics_clients_new_old')}
        </Typography>
        <div className={styles.clientsContainer}>
          <Typography className={styles.counterLabel}>
            359{' '}
            <span className={styles.divider}>/</span>{' '}
            <span className={styles.debt}>430</span>
          </Typography>
        </div>
      </div>
    </Grid>
  )
};

export default ClientsChart;
