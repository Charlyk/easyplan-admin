import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@easyplanpro/easyplan-components';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { formatInTimeZone } from 'date-fns-tz';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import {
  DateLocales,
  SubscriptionStatuses,
  PaymentStatuses,
} from 'app/utils/constants';
import formatAmountWithSymbol from 'app/utils/formatAmountWithSymbol';
import { textForKey } from 'app/utils/localization';
import {
  appLanguageSelector,
  clinicTimeZoneSelector,
} from 'redux/selectors/appDataSelector';
import {
  paymentsSubscriptionSelector,
  paymentsPaymentMethodsSelector,
  isPaymentDataLoadingSelector,
  paymentsInvoicesSelector,
  paymentsNewCardModalSelector,
} from 'redux/selectors/paymentsSelector';
import {
  dispatchFetchSubscriptionInfo,
  dispatchFetchPaymentMethods,
  dispatchFetchInvoices,
  dispatchRetryPayment,
} from 'redux/slices/paymentSlice';
import styles from './BillingDetails.module.scss';
import {
  BillingDetailsViewMode,
  BillingDetailsProps,
} from './BillingDetails.types';

const PaymentHistory = dynamic(() => import('./Views/PaymentHistory'));
const PaymentMethods = dynamic(() => import('./Views/PaymentMethods'));
const SeatsManagement = dynamic(() => import('./Views/SeatsManagement'));
const NewCardModal = dynamic(() => import('./NewCardModal/NewCardModal'));
const PaymentPlan = dynamic(import('./Views/PaymentPlan'));

const BillingDetails: React.FC<BillingDetailsProps> = ({ countries }) => {
  const dispatch = useDispatch();
  const [selectedView, setSelectedView] =
    useState<BillingDetailsViewMode>('payment-history');
  const { loading: subscriptionLoading, data: subscriptionData } = useSelector(
    paymentsSubscriptionSelector,
  );
  const { loading: paymentMethodLoading, data: paymentMethods } = useSelector(
    paymentsPaymentMethodsSelector,
  );
  const { loading: invoicesLoading } = useSelector(paymentsInvoicesSelector);
  const modalOpen = useSelector(paymentsNewCardModalSelector);
  const isDataLoading = useSelector(isPaymentDataLoadingSelector);
  const timeZone = useSelector(clinicTimeZoneSelector);
  const appLanguage = useSelector(appLanguageSelector);

  const defaultPaymentMethod = useMemo(() => {
    if (!paymentMethods) return null;
    const defaultMethod = paymentMethods.find((method) => method.isDefault);
    return defaultMethod ?? null;
  }, [paymentMethods]);

  const loading = useMemo(() => {
    return subscriptionLoading || paymentMethodLoading || invoicesLoading;
  }, [subscriptionLoading, paymentMethodLoading, invoicesLoading]);

  const shouldRenderAlert = useMemo(() => {
    const { paymentStatus, status } = subscriptionData;
    const correspondingSubscriptionStatus =
      status === SubscriptionStatuses.unpaid ||
      status === SubscriptionStatuses.incomplete_expired;

    const correspondingPaymentStatus =
      paymentStatus === PaymentStatuses.draft ||
      paymentStatus === PaymentStatuses.open ||
      paymentStatus === PaymentStatuses.uncollectible;

    return correspondingSubscriptionStatus || correspondingPaymentStatus;
  }, [subscriptionData]);

  useEffect(() => {
    dispatch(dispatchFetchInvoices());
    dispatch(dispatchFetchPaymentMethods());
    dispatch(dispatchFetchSubscriptionInfo());
  }, []);

  const handleViewModeSwitch = (newMode: BillingDetailsViewMode) => {
    setSelectedView(newMode);
  };

  const handleGoBack = () => {
    handleViewModeSwitch('payment-history');
  };

  const handleRetryPayment = () => {
    dispatch(dispatchRetryPayment());
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      {modalOpen && <NewCardModal countries={countries} />}
      <div className={styles.wrapper}>
        {shouldRenderAlert && (
          <Alert
            severity={'warning'}
            classes={{ message: styles.alertContainer }}
          >
            <Box display={'flex'} alignItems={'center'}>
              <Typography>{textForKey('transaction_unsuccessful')}</Typography>
              <Button variant={'outlined'} onClick={handleRetryPayment}>
                {textForKey('retry_payment')}
              </Button>
            </Box>
          </Alert>
        )}
        <div className={styles.introHeader}>
          <div className={styles.infoBox}>
            <Typography className={styles.infoBoxHeader}>
              {textForKey('current_bill')}
            </Typography>
            <Typography
              classes={{
                root: styles.infoBoxAmount,
              }}
            >
              {formatAmountWithSymbol(
                subscriptionData.nextAmount,
                subscriptionData.nextCurrency,
              )}{' '}
              / {subscriptionData.totalSeats} {textForKey('seats')}
            </Typography>
            <Box onClick={() => handleViewModeSwitch('manage-seats')}>
              <Typography classes={{ root: styles.infoBoxLink }}>
                {textForKey('manage_seats')}
                {subscriptionData.availableSeats > 0 &&
                  `(${subscriptionData.availableSeats} ${textForKey(
                    'seats_available',
                  )})`}
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
              {textForKey('payment_due')}
            </Typography>
            <Typography
              classes={{
                root: styles.infoBoxAmount,
              }}
            >
              {formatInTimeZone(
                subscriptionData.nextPayment === '' ||
                  !subscriptionData.nextPayment
                  ? new Date()
                  : subscriptionData.nextPayment,
                timeZone,
                'dd MMM yyyy',
                {
                  locale: DateLocales[appLanguage],
                },
              )}
            </Typography>
            <Box onClick={() => handleViewModeSwitch('payment-plan')}>
              <Typography classes={{ root: styles.infoBoxLink }}>
                {textForKey(
                  subscriptionData.interval === 'MONTH'
                    ? 'switch_year_plan'
                    : 'switch_month_plan',
                )}
              </Typography>
            </Box>
          </div>

          <div className={styles.infoBox}>
            <Typography className={styles.infoBoxHeader}>
              {textForKey('payment_method')}
            </Typography>
            <Typography
              classes={{
                root: styles.infoBoxAmount,
              }}
            >
              {defaultPaymentMethod
                ? `**** **** **** ${defaultPaymentMethod.last4}`
                : '**** **** **** 0000'}
            </Typography>
            <Box onClick={() => handleViewModeSwitch('payment-method')}>
              <Typography classes={{ root: styles.infoBoxLink }}>
                {textForKey('manage_payment_method')}
              </Typography>
            </Box>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.btnWrapper}>
            {selectedView !== 'payment-history' && (
              <Button
                variant='text'
                label={textForKey('back_to_payment_history')}
                onClick={handleGoBack}
                startIcon='arrow-back'
                sx={{ textTransform: 'none !important' }}
              />
            )}
            {isDataLoading && <CircularProgress />}
          </div>
          {selectedView === 'payment-history' && <PaymentHistory />}
          {selectedView === 'payment-method' && (
            <PaymentMethods countries={countries} />
          )}
          {selectedView === 'manage-seats' && (
            <SeatsManagement onCancel={handleGoBack} />
          )}
          {selectedView === 'payment-plan' && (
            <PaymentPlan onCancel={handleGoBack} />
          )}
        </div>
      </div>
    </>
  );
};

export default BillingDetails;