import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import { useTranslate } from 'react-polyglot';
import IconClose from 'app/components/icons/iconClose';
import { ChartType } from 'types/ChartType.type';
import { AnalyticsConversion, ChartProps } from '../ClinicAnalytics.types';
import { getConversionsChartData } from '../ClinicAnalytics.utils';
import styles from './DoctorsConversionChart.module.scss';

interface DoctorsConversionChartProps extends ChartProps {
  conversions: AnalyticsConversion[];
}

const DoctorsConversionChart: React.FC<DoctorsConversionChartProps> = ({
  onClose,
  removeable = false,
  conversions = [],
  visible = true,
}) => {
  const textForKey = useTranslate();
  const data = useMemo(() => {
    return getConversionsChartData(conversions);
  }, [conversions]);

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
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
        <Typography className='chartTitle'>
          {textForKey('analytics_doctor_conversion')}
        </Typography>
        <div className={styles.chartWrapper}>
          <Bar
            data={data}
            options={{
              maintainAspectRatio: true,
              responsive: true,
              indexAxis: 'x',
              plugins: {
                legend: {
                  align: 'start',
                  display: false,
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
      </div>
    </Grid>
  );
};

export default DoctorsConversionChart;
