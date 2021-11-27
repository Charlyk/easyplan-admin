import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import IconClose from 'app/components/icons/iconClose';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { ChartType } from 'types/ChartType.type';
import styles from './AmountsChart.module.scss';

const AmountsChart = ({ currency, payments, onClose, visible = true }) => {
  if (!visible || payments == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.Income);
  };

  return (
    <Grid item xs={6} className={styles.amountsChartRoot}>
      <div className='chartItem'>
        <div className='buttonContainer'>
          <IconButton onClick={handleClose}>
            <IconClose />
          </IconButton>
        </div>
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

AmountsChart.propTypes = {
  visible: PropTypes.bool,
  currency: PropTypes.string,
  payments: PropTypes.shape({
    paidAmount: PropTypes.number,
    debtAmount: PropTypes.number,
  }),
  onClose: PropTypes.func,
};

AmountsChart.defaultProps = {
  currency: 'MDL',
  payments: {
    paidAmount: 0.0,
    debtAmount: 0.0,
  },
};
