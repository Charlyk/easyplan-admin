import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { PolarArea } from 'react-chartjs-2';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { getDoctorIncomeChartData } from '../ClinicAnalytics.utils';
import styles from './DoctorsIncomeChart.module.scss';

const DoctorsIncomeChart = ({ incomes, currency }) => {
  const data = useMemo(() => {
    return getDoctorIncomeChartData(incomes);
  }, [incomes]);

  const getLabelText = (context) => {
    let label = context.label || '';
    if (label) {
      label += `: ${formattedAmount(context.raw, currency)}`;
    }
    return label;
  };

  return (
    <Grid item xs={3} className={styles.doctorsIncomeChart}>
      <div className={clsx(styles.incomeChartWrapper, 'chartItem')}>
        <Typography className='chartTitle'>
          {textForKey('analytics_doctor_income')}
        </Typography>
        <PolarArea
          type='polarArea'
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

export default DoctorsIncomeChart;
