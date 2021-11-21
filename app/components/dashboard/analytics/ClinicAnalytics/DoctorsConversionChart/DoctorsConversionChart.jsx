import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import { textForKey } from 'app/utils/localization';
import { getBarchartTestData, barChartOptions } from '../ClinicAnalytics.utils';
import styles from './DoctorsConversionChart.module.scss';

const DoctorsConversionChart = () => {
  return (
    <Grid item xs={6} className={styles.doctorsConversionChart}>
      <div className='chartItem'>
        <Typography className='chartTitle'>
          {textForKey('analytics_doctor_conversion')}
        </Typography>
        <div className={styles.chartWrapper}>
          <Bar
            type='bar'
            data={getBarchartTestData()}
            options={barChartOptions}
          />
        </div>
      </div>
    </Grid>
  );
};

export default DoctorsConversionChart;
