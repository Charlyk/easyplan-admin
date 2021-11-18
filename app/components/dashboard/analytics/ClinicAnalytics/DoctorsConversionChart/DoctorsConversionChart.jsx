import React from "react";
import { Bar } from 'react-chartjs-2';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { getBarchartTestData, barChartOptions } from '../ClinicAnalytics.utils';
import styles from './DoctorsConversionChart.module.scss';

const DoctorsConversionChart = () => {
  return (
    <Grid item xs={6} className={styles.doctorsConversionChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          Conversie / Medic
        </Typography>
        <div className={styles.chartWrapper}>
          <Bar
            type="bar"
            data={getBarchartTestData()}
            options={barChartOptions}
          />
        </div>
      </div>
    </Grid>
  )
};

export default DoctorsConversionChart;
