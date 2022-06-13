import React, { useState } from 'react';
import {
  Typography,
  EASIcon,
  Checkbox,
  Button,
  theme,
} from '@easyplanpro/easyplan-components';
import { useTranslate } from 'react-polyglot';
import { useSelector, useDispatch } from 'react-redux';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import { SubscriptionStatuses } from 'app/utils/constants';
import { paymentsSubscriptionSelector } from 'redux/selectors/paymentsSelector';
import {
  dispatchCancelSubcription,
  dispatchChangeBillingPeriod,
} from 'redux/slices/paymentSlice';
import styles from './ViewStyles/PaymentPlan.module.scss';

type Props = {
  onCancel(): void;
};

const PaymentPlan: React.FC<Props> = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: subscription } = useSelector(paymentsSubscriptionSelector);
  const [interval, setInterval] = useState(subscription.interval);

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
    setModalOpen(false);
  };

  return (
    <>
      {modalOpen && (
        <ConfirmationModal
          show={modalOpen}
          onConfirm={cancelSubscription}
          onClose={() => setModalOpen(false)}
          title={textForKey('confirm')}
          message={textForKey('cancel_subscription_confirmation')}
        />
      )}
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
                <Button
                  label={textForKey('confirm')}
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
                  onClick={() => setModalOpen(true)}
                  size={'small'}
                  className={styles.cancelButton}
                  disabled={
                    subscription.status === SubscriptionStatuses.canceled
                  }
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
