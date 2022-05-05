import React, { useState } from 'react';
import {
  Typography,
  EASIcon,
  Checkbox,
  LoadingButton,
  Button,
  theme,
} from '@easyplanpro/easyplan-components';
import { useSelector, useDispatch } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import {
  isPaymentDataLoadingSelector,
  paymentsSubscriptionSelector,
} from 'redux/selectors/paymentsSelector';
import {
  dispatchCancelSubcription,
  dispatchChangeBillingPeriod,
} from 'redux/slices/paymentSlice';
import styles from './ViewStyles/PaymentPlan.module.scss';

type Props = {
  onCancel(): void;
};

const PaymentPlan: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { data: subscription } = useSelector(paymentsSubscriptionSelector);
  const isDataLoading = useSelector(isPaymentDataLoadingSelector);
  const [interval, setInterval] = useState(
    subscription.nextInterval ?? subscription.interval,
  );

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = evt.target;
    if (!checked) return;

    setInterval(name as 'MONTH' | 'YEAR');
  };

  const submitResponse = () => {
    dispatch(dispatchChangeBillingPeriod({ period: interval }));
  };

  const cancelSubscription = () => {
    dispatch(dispatchCancelSubcription());
  };

  return (
    <>
      <div className={styles.divider} />
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.gridCell}>
            <div className={styles.header}>
              <Typography>{textForKey('payment_frequency')}?</Typography>
            </div>
            <div className={styles.cellContent}>
              <div className={styles.checkboxWrapper}>
                <div className={styles.checkbox}>
                  <Checkbox
                    label={textForKey('monthly')}
                    checked={interval === 'MONTH'}
                    checkType='check'
                    onChange={handleChange}
                    disabled={false}
                    name={'MONTH'}
                  />
                </div>

                <div className={styles.checkbox}>
                  <Checkbox
                    label={textForKey('yearly')}
                    checked={interval === 'YEAR'}
                    checkType='check'
                    onChange={handleChange}
                    disabled={false}
                    name={'YEAR'}
                  />
                  <Typography
                    variant={'bodySmall'}
                    color={theme.palette.primary.main}
                  >
                    {textForKey('discount_notice')}
                  </Typography>
                </div>
              </div>
              <div className={styles.btnWrapper}>
                <LoadingButton
                  label={textForKey('confirm')}
                  loading={isDataLoading}
                  disabled={interval === subscription.interval}
                  variant={'contained'}
                  onClick={submitResponse}
                  size={'small'}
                />
              </div>
            </div>
            <EASIcon
              name={'clock'}
              fillColor={theme.palette.primary.main}
              size={2}
            />
            <div className={styles.verticalDivider} />
          </div>
          <div className={styles.gridCell}>
            <div className={styles.header}>
              <Typography>{textForKey('delete_subscription')}</Typography>
            </div>
            <div className={styles.cellContent}>
              <Typography>{textForKey('delete_subscription_info')}</Typography>
              <div className={styles.btnWrapper} style={{ marginTop: '1em' }}>
                <Button
                  label={textForKey('cancel_schedule')}
                  variant={'contained'}
                  onClick={cancelSubscription}
                  size={'small'}
                  className={styles.cancelButton}
                />
              </div>
            </div>
            <EASIcon
              name={'delete'}
              fillColor={theme.palette.primary.main}
              size={2}
            />
            <div className={styles.verticalDivider} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPlan;
