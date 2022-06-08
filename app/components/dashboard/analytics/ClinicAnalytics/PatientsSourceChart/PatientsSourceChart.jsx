import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import { useTranslate } from 'react-polyglot';
import IconClose from 'app/components/icons/iconClose';
import { ChartType } from 'types/ChartType.type';
import {
  getChartOptions,
  getPatientsSourceData,
} from '../ClinicAnalytics.utils';
import styles from './PatientsSourceChart.module.scss';

const PatientsSourceChart = ({
  sources,
  removeable,
  onClose,
  visible = true,
}) => {
  const textForKey = useTranslate();
  const data = useMemo(() => {
    return getPatientsSourceData(sources);
  }, [sources]);

  const options = useMemo(() => {
    return getChartOptions('center', false, 'y', false);
  }, []);

  if (!visible || sources == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.ClientsSource);
  };

  return (
    <Grid item xs={12} className={styles.patientsSourceChart}>
      <div className='chartItem'>
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
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
