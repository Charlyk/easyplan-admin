import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { Pie } from 'react-chartjs-2';
import { textForKey } from 'app/utils/localization';
import { getDoctorVisitsData } from '../ClinicAnalytics.utils';
import styles from './DoctorVisitsChart.module.scss';
import { DoctorVisitsChartProps } from './DoctorVisitsChart.types';

const DoctorVisitsChart: React.FC<DoctorVisitsChartProps> = ({ visits }) => {
  const data = useMemo(() => {
    return getDoctorVisitsData(visits);
  }, [visits]);

  return (
    <Grid item xs={3} className={styles.doctorVisitsChart}>
      <div className={clsx(styles.visitsChart, 'chartItem')}>
        <Typography className='chartTitle'>
          {textForKey('analytics_doctor_visits')}
        </Typography>
        <Pie
          data={data}
          height={120}
          options={{
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          }}
        />
      </div>
    </Grid>
  );
};

export default DoctorVisitsChart;
