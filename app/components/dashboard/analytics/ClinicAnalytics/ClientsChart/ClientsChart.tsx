import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'react-polyglot';
import IconClose from 'app/components/icons/iconClose';
import { ChartType } from 'types/ChartType.type';
import { AnalyticsClients, ChartProps } from '../ClinicAnalytics.types';
import styles from './ClientsChart.module.scss';

interface ClientsChartProps extends ChartProps {
  clients: AnalyticsClients;
}

const ClientsChart: React.FC<ClientsChartProps> = ({
  clients,
  onClose,
  removeable = false,
  visible = true,
}) => {
  const textForKey = useTranslate();
  if (!visible || clients == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.ClientsNewReturn);
  };
  return (
    <Grid item xs={6} className={styles.clientsChart}>
      <div className='chartItem'>
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
        <Typography className='chartTitle'>
          {textForKey('analytics_clients_new_old')}
        </Typography>
        <div className={styles.clientsContainer}>
          <Typography className={styles.counterLabel}>
            {clients.new} <span className={styles.divider}>/</span>{' '}
            <span className={styles.debt}>{clients.repeated}</span>
          </Typography>
        </div>
      </div>
    </Grid>
  );
};

export default ClientsChart;
