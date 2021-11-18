import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import styles from "./AmountsChart.module.scss";

const AmountsChart = () => {
  return (
    <Grid item xs={6} className={styles.amountsChartRoot}>
      <div className="chartItem">
        <Typography className="chartTitle">
          Achitat / Datorii
        </Typography>
        <div className={styles.amountsContainer}>
          <Typography className={styles.counterLabel}>
            230,132 MDL{' '}
            <span className={styles.divider}>/</span>{' '}
            <span className={styles.debt}>42,321 MDL</span>
          </Typography>
        </div>
      </div>
    </Grid>
  )
};

export default AmountsChart;
