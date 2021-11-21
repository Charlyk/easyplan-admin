import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { Pie } from 'react-chartjs-2';
import { textForKey } from 'app/utils/localization';
import {
  getDoctorVisitsData,
  rightLegendOptions,
} from '../ClinicAnalytics.utils';
import styles from './DoctorVisitsChart.module.scss';

const DoctorVisitsChart = () => {
  return (
    <Grid item xs={3} className={styles.doctorVisitsChart}>
      <div className={clsx(styles.visitsChart, 'chartItem')}>
        <Typography className='chartTitle'>
          {textForKey('analytics_doctor_visits')}
        </Typography>
        <Pie
          type='pie'
          data={getDoctorVisitsData()}
          height={120}
          options={rightLegendOptions}
        />
      </div>
    </Grid>
  );
};

export default DoctorVisitsChart;
