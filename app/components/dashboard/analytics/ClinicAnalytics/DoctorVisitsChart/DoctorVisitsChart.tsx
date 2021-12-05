import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { TooltipItem } from 'chart.js';
import clsx from 'clsx';
import { Pie } from 'react-chartjs-2';
import IconClose from 'app/components/icons/iconClose';
import { textForKey } from 'app/utils/localization';
import { ChartType } from 'types/ChartType.type';
import { getDoctorVisitsData } from '../ClinicAnalytics.utils';
import styles from './DoctorVisitsChart.module.scss';
import { DoctorVisitsChartProps } from './DoctorVisitsChart.types';

const DoctorVisitsChart: React.FC<DoctorVisitsChartProps> = ({
  visits = [],
  removeable,
  onClose,
  visible = true,
}) => {
  const data = useMemo(() => {
    return getDoctorVisitsData(visits);
  }, [visits]);

  if (!visible || visits == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.DoctorsVisits);
  };

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
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
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
