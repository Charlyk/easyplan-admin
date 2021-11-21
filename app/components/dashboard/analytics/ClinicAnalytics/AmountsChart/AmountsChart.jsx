import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import styles from './AmountsChart.module.scss';

const AmountsChart = ({ currency, payments }) => {
  return (
    <Grid item xs={6} className={styles.amountsChartRoot}>
      <div className='chartItem'>
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
  currency: PropTypes.string,
  payments: PropTypes.shape({
    paidAmount: PropTypes.number,
    debtAmount: PropTypes.number,
  }),
};

AmountsChart.defaultProps = {
  currency: 'MDL',
  payments: {
    paidAmount: 0.0,
    debtAmount: 0.0,
  },
};
