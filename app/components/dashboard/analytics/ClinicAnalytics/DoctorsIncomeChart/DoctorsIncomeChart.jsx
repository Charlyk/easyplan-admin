import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { PolarArea } from 'react-chartjs-2';
import IconClose from 'app/components/icons/iconClose';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { ChartType } from 'types/ChartType.type';
import { getDoctorIncomeChartData } from '../ClinicAnalytics.utils';
import styles from './DoctorsIncomeChart.module.scss';

const DoctorsIncomeChart = ({ incomes, currency, onClose, visible = true }) => {
  const data = useMemo(() => {
    return getDoctorIncomeChartData(incomes);
  }, [incomes]);

  if (!visible || incomes == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.DoctorsIncome);
  };

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
        <div className='buttonContainer'>
          <IconButton onClick={handleClose}>
            <IconClose />
          </IconButton>
        </div>
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
