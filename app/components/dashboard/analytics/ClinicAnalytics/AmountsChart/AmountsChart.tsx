import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'react-polyglot';
import IconClose from 'app/components/icons/iconClose';
import formattedAmount from 'app/utils/formattedAmount';
import { ChartType } from 'types/ChartType.type';
import { AnalyticsPayments, ChartProps } from '../ClinicAnalytics.types';
import styles from './AmountsChart.module.scss';

interface AmountsChartProps extends ChartProps {
  currency: string;
  payments: AnalyticsPayments;
}

const AmountsChart: React.FC<AmountsChartProps> = ({
  currency,
  removeable,
  payments,
  onClose,
  visible = true,
}) => {
  const textForKey = useTranslate();

  if (!visible || payments == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.Income);
  };

  return (
    <Grid item xs={6} className={styles.amountsChartRoot}>
      <div className='chartItem'>
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
        <Typography className='chartTitle'>
          {textForKey('analytics_paid_unpaid')}
        </Typography>
        <div className={styles.amountsContainer}>
          <Typography className={styles.counterLabel}>
            {formattedAmount(payments.paidAmount, currency)}{' '}
            <span className={styles.divider}>/</span>{' '}
            <span className={styles.debt}>
              {formattedAmount(payments.debtAmount, currency)}
            </span>
          </Typography>
        </div>
      </div>
    </Grid>
  );
};

export default AmountsChart;
