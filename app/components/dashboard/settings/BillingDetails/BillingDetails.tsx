import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@easyplanpro/easyplan-components';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import {
  paymentsSubscriptionSelector,
  paymentsPaymentMethodsSelector,
} from 'redux/selectors/paymentsSelector';
import {
  dispatchFetchSubscriptionInfo,
  dispatchFetchPaymentMethods,
  dispatchFetchInvoices,
} from 'redux/slices/paymentSlice';
import styles from './BillingDetails.module.scss';
import { BillingDetailsViewMode } from './BillingDetails.types';

const PaymentHistory = dynamic(() => import('./Views/PaymentHistory'));
const PaymentMethods = dynamic(() => import('./Views/PaymentMethods'));
const SeatsManagement = dynamic(() => import('./Views/SeatsManagement'));
const PaymentPlan = dynamic(import('./Views/PaymentPlan'));

const BillingDetails: React.FC = () => {
  const dispatch = useDispatch();
  const initialRenderRef = useRef(false);
  const [selectedView, setSelectedView] =
    useState<BillingDetailsViewMode>('payment-history');
  const {
    loading: subscriptionLoading,
    data: subscriptionData,
    error: subscriptionError,
  } = useSelector(paymentsSubscriptionSelector);
  const {
    loading: paymentMethodLoading,
    data: paymentMethods,
    error: paymentMethodError,
  } = useSelector(paymentsPaymentMethodsSelector);

  const loading = useMemo(() => {
    return subscriptionLoading || paymentMethodLoading;
  }, [subscriptionLoading, paymentMethodLoading]);

  useEffect(() => {
    dispatch(dispatchFetchSubscriptionInfo());
    dispatch(dispatchFetchInvoices());
    dispatch(dispatchFetchPaymentMethods());
    initialRenderRef.current = true;
  }, []);

  const handleViewModeSwitch = (newMode: BillingDetailsViewMode) => {
    setSelectedView(newMode);
  };

  if (loading && !initialRenderRef.current) {
    return (
      <div className={styles.loadingWrapper}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.introHeader}>
        <div className={styles.infoBox}>
          <Typography className={styles.infoBoxHeader}>
            Current Monthly Bill
          </Typography>
          <Typography
            classes={{
              root: styles.infoBoxAmount,
            }}
          >
            {subscriptionData.totalSeats > 0
              ? subscriptionData.nextAmount
              : textForKey('no_seats_notice')}
          </Typography>
          <Box onClick={() => handleViewModeSwitch('manage-seats')}>
            <Typography classes={{ root: styles.infoBoxLink }}>
              Manage Seats
            </Typography>
          </Box>
        </div>

        <div className={styles.infoBox}>
          <Typography
            classes={{
              root: styles.infoBoxHeader,
            }}
            className={styles.infoBoxHeader}
          >
            Next Payment Due
          </Typography>
          <Typography
            classes={{
              root: styles.infoBoxAmount,
            }}
          >
            {subscriptionData.nextPayment !== ''
              ? subscriptionData.nextPayment
              : textForKey('no_plan_notice')}
          </Typography>
          <Box onClick={() => handleViewModeSwitch('payment-plan')}>
            <Typography classes={{ root: styles.infoBoxLink }}>
              Switch to yearly plan and save
            </Typography>
          </Box>
        </div>

        <div className={styles.infoBox}>
          <Typography className={styles.infoBoxHeader}>
            Payment Method
          </Typography>
          <Typography
            classes={{
              root: styles.infoBoxAmount,
            }}
          >
            **** **** **** 5543
          </Typography>
          <Box onClick={() => handleViewModeSwitch('payment-method')}>
            <Typography classes={{ root: styles.infoBoxLink }}>
              Manage Payment Method
            </Typography>
          </Box>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.btnWrapper}>
          {selectedView !== 'payment-history' && (
            <Button
              variant='text'
              label='Back to Payment History'
              onClick={() => handleViewModeSwitch('payment-history')}
              startIcon='arrow-back'
              sx={{ textTransform: 'none !important' }}
            />
          )}
        </div>
        {subscriptionError && selectedView === 'payment-history' && (
          <Typography>
            {subscriptionError === 'no_purchased_subscription'
              ? textForKey(subscriptionError)
              : subscriptionError}
          </Typography>
        )}
        {!subscriptionError && selectedView === 'payment-history' && (
          <PaymentHistory />
        )}
        {selectedView === 'payment-method' && <PaymentMethods />}
        {selectedView === 'manage-seats' && <SeatsManagement />}
        {selectedView === 'payment-plan' && <PaymentPlan />}
      </div>
    </div>
  );
};

export default BillingDetails;
