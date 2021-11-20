import React from "react";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";
import formattedNumber from "../../../../../utils/formattedNumber";
import styles from './TotalVisitsChart.module.scss';

const TotalVisitsChart = ({ visits }) => {
  return (
    <Grid item xs={4} className={styles.totalVisitsChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          {textForKey('analytics_total_visits')}
        </Typography>
        <div className={styles.visitsCountContainer}>
          <Typography className={styles.counterLabel}>{formattedNumber(visits || 0)}</Typography>
        </div>
      </div>
    </Grid>
  );
};

export default TotalVisitsChart;

TotalVisitsChart.propTypes = {
  visits: PropTypes.number
}
