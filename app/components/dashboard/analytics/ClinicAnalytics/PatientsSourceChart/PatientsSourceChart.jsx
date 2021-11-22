import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import { textForKey } from 'app/utils/localization';
import {
  getChartOptions,
  getPatientsSourceData,
} from '../ClinicAnalytics.utils';
import styles from './PatientsSourceChart.module.scss';

const PatientsSourceChart = ({ sources }) => {
  const data = useMemo(() => {
    return getPatientsSourceData(sources);
  }, [sources]);

  const options = useMemo(() => {
    return getChartOptions('start', false, 'y');
  }, []);

  return (
    <Grid item xs={12} className={styles.patientsSourceChart}>
      <div className='chartItem'>
        <Typography className='chartTitle'>
          {textForKey('analytics_clients_source')}
        </Typography>
        <div className={styles.chartWrapper}>
          <Bar type='bar' height={400} data={data} options={options} />
        </div>
      </div>
    </Grid>
  );
};

export default PatientsSourceChart;
