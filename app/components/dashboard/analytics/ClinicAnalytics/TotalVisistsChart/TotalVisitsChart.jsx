import React from "react";
import Grid from "@material-ui/core/Grid";
import styles from './TotalVisitsChart.module.scss';
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";

const TotalVisitsChart = () => {
  return (
    <Grid item xs={4} className={styles.totalVisitsChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          {textForKey('analytics_total_visits')}
        </Typography>
        <div className={styles.visitsCountContainer}>
          <Typography className={styles.counterLabel}>340</Typography>
        </div>
      </div>
    </Grid>
  );
};

export default TotalVisitsChart;
