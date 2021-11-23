import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TooltipItem } from 'chart.js';
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

  const getLabelText = (context: TooltipItem<'pie'>): string => {
    let label = context.label || '';
    if (label) {
      label += `: ${context.raw} ${textForKey('visits')}`;
    }
    return label;
  };

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
              tooltip: {
                callbacks: {
                  label: getLabelText,
                },
              },
            },
          }}
        />
      </div>
    </Grid>
  );
};

export default DoctorVisitsChart;
