import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { getHorizontalBarTestData, horizontalBarOptions } from '../ClinicAnalytics.utils';
import styles from './PatientsSourceChart.module.scss';
import { Bar } from "react-chartjs-2";

const PatientsSourceChart = () => {
  return (
    <Grid item xs={12} className={styles.patientsSourceChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          Sursa clientilor
        </Typography>
        <div className={styles.chartWrapper}>
          <Bar
            type="bar"
            height={400}
            data={getHorizontalBarTestData()}
            options={horizontalBarOptions}
          />
        </div>
      </div>
    </Grid>
  );
};

export default PatientsSourceChart;
