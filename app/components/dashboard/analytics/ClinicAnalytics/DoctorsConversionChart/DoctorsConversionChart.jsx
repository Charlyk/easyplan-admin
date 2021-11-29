import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import IconClose from 'app/components/icons/iconClose';
import { textForKey } from 'app/utils/localization';
import { ChartType } from 'types/ChartType.type';
import {
  getConversionsChartData,
  getChartOptions,
} from '../ClinicAnalytics.utils';
import styles from './DoctorsConversionChart.module.scss';

const DoctorsConversionChart = ({
  onClose,
  conversions = [],
  visible = true,
}) => {
  const data = useMemo(() => {
    return getConversionsChartData(conversions);
  }, [conversions]);

  const options = useMemo(() => {
    return getChartOptions('start', true, 'x', false);
  }, []);

  if (!visible) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.DoctorsConversion);
  };

  const getLabelText = (context) => {
    let label = context.label || '';
    if (label) {
      label += `: ${context.raw} ${textForKey('patients')}`;
    }
    return label;
  };

  return (
    <Grid item xs={6} className={styles.doctorsConversionChart}>
      <div className='chartItem'>
        <div className='buttonContainer'>
          <IconButton onClick={handleClose}>
            <IconClose />
          </IconButton>
        </div>
        <Typography className='chartTitle'>
          {textForKey('analytics_doctor_conversion')}
        </Typography>
        <div className={styles.chartWrapper}>
          <Bar
            type='bar'
            data={data}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                tooltip: {
                  callbacks: {
                    label: getLabelText,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </Grid>
  );
};

export default DoctorsConversionChart;
