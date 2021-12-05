import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import IconClose from 'app/components/icons/iconClose';
import { textForKey } from 'app/utils/localization';
import { ChartType } from 'types/ChartType.type';
import {
  getServicesChartData,
  getChartOptions,
} from '../ClinicAnalytics.utils';
import styles from './ServicesChart.module.scss';

const ServicesChart = ({ services, removeable, onClose, visible = true }) => {
  const data = useMemo(() => {
    return getServicesChartData(services);
  }, [services]);

  const options = useMemo(() => {
    return getChartOptions('center', false);
  }, []);

  if (!visible || services == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.Services);
  };

  return (
    <Grid item xs={12} className={styles.servicesChart}>
      <div className={clsx(styles.servicesChart, 'chartItem')}>
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
        <Typography className='chartTitle'>
          {textForKey('analytics_services_completed_planned')}
        </Typography>
        <div className={styles.chartWrapper}>
          <Line type='line' height={50} data={data} options={options} />
        </div>
      </div>
    </Grid>
  );
};

export default ServicesChart;

ServicesChart.propTypes = {
  visible: PropTypes.bool,
  removeable: PropTypes.bool,
  services: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    planned: PropTypes.arrayOf(PropTypes.number),
    completed: PropTypes.arrayOf(PropTypes.number),
  }),
};
