import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { PolarArea } from 'react-chartjs-2';
import { textForKey } from 'app/utils/localization';
import {
  getDoctorIncomeChartData,
  rightLegendOptions,
} from '../ClinicAnalytics.utils';
import styles from './DoctorsIncomeChart.module.scss';

const DoctorsIncomeChart = () => {
  return (
    <Grid item xs={3} className={styles.doctorsIncomeChart}>
      <div className={clsx(styles.incomeChartWrapper, 'chartItem')}>
        <Typography className='chartTitle'>
          {textForKey('analytics_doctor_income')}
        </Typography>
        <PolarArea
          type='polarArea'
          data={getDoctorIncomeChartData()}
          height={120}
          options={rightLegendOptions}
        />
      </div>
    </Grid>
  );
};

export default DoctorsIncomeChart;
