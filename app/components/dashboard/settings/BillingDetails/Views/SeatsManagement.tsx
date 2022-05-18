import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Typography,
  TextField,
  Button,
  LoadingButton,
} from '@easyplanpro/easyplan-components';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  differenceInDays,
  differenceInMonths,
  addMonths,
  intervalToDuration,
} from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { useSelector, useDispatch } from 'react-redux';
import { DateLocales } from 'app/utils/constants';
import formatAmountWithSymbol from 'app/utils/formatAmountWithSymbol';
import { textForKey } from 'app/utils/localization';
import { clinicDoctorsSelector } from 'redux/selectors/appDataSelector';
import {
  clinicTimeZoneSelector,
  appLanguageSelector,
} from 'redux/selectors/appDataSelector';
import {
  isPaymentDataLoadingSelector,
  paymentsPaymentMethodsSelector,
  paymentsSubscriptionSelector,
} from 'redux/selectors/paymentsSelector';
import {
  dispatchPurchaseSeats,
  dispatchRemoveSeats,
  openNewCardModal,
} from 'redux/slices/paymentSlice';
import styles from './ViewStyles/SeatsManagement.module.scss';

type Props = {
  onCancel(): void;
};

const costOfOneMonthYearPlan = 30;
const costOfOneMonthMonthPlan = 35;

const SeatsManagement: React.FC<Props> = ({ onCancel }) => {
  const dispatch = useDispatch();
  const initialRenderRef = useRef(false);
  const [noOfSeats, setNoOfSeats] = useState('1');
  const { data: subscription } = useSelector(paymentsSubscriptionSelector);
  const { data: paymentMethods } = useSelector(paymentsPaymentMethodsSelector);
  const doctors = useSelector(clinicDoctorsSelector);
  const appLanguage = useSelector(appLanguageSelector);
  const timeZone = useSelector(clinicTimeZoneSelector);
  const isDataLoading = useSelector(isPaymentDataLoadingSelector);

  console.log('payment-method: ', paymentMethods);

  useEffect(() => {
    if (!isDataLoading && initialRenderRef.current) {
      setNoOfSeats('1');
      onCancel();
    }
    if (!initialRenderRef.current) {
      initialRenderRef.current = true;
    }
  }, [isDataLoading]);

  const paymentDueString = useMemo(() => {
    return formatInTimeZone(
      !subscription.nextPayment ? new Date() : subscription.nextPayment,
      timeZone,
      'dd MMM yyyy',
      {
        locale: DateLocales[appLanguage],
      },
    );
  }, [subscription.nextPayment]);

  const isAddingSeats = useMemo(() => {
    return subscription.availableSeats === 0;
  }, [subscription.availableSeats]);

  const costOfOneDay = useMemo(() => {
    const { interval } = subscription;
    if (interval === 'MONTH') return Math.trunc(costOfOneMonthMonthPlan / 30);
    else {
      return Math.trunc(30 / costOfOneMonthYearPlan);
    }
  }, [subscription.nextPayment, subscription.interval]);

  const timeLeftTillPaymentDue = useMemo(() => {
    const { interval, nextPayment } = subscription;
    if (interval === 'MONTH')
      return `${differenceInDays(
        new Date(subscription.nextPayment),
        new Date(),
      )}`;
    else {
      const today = new Date();
      const duePaymentDate = utcToZonedTime(nextPayment, timeZone);
      const duration = intervalToDuration({
        start: today,
        end: duePaymentDate,
      });
      return `${
        duration.years > 0 ? `${duration.years}${textForKey('year')}` : ''
      } ${duration.months} ${textForKey('months')} ${duration.days}`;
    }
  }, [subscription.nextPayment, subscription.interval]);

  const costOfOneSeat = useMemo(() => {
    const { interval, nextPayment } = subscription;
    if (interval === 'MONTH') {
      return Math.trunc(
        differenceInDays(new Date(subscription.nextPayment), new Date()) *
          costOfOneDay,
      );
    } else {
      const today = new Date();
      const duePaymentDate = utcToZonedTime(nextPayment, timeZone);
      const fullMonthsLeft = differenceInMonths(duePaymentDate, today);
      const todayWithMonthsAdded = addMonths(today, fullMonthsLeft);
      const daysLeft = differenceInDays(duePaymentDate, todayWithMonthsAdded);
      return fullMonthsLeft * costOfOneMonthYearPlan + daysLeft * costOfOneDay;
    }
  }, [costOfOneDay, timeLeftTillPaymentDue, subscription.interval]);

  const parsedNoOfSeats = useMemo(() => {
    return parseInt(noOfSeats === '' ? '0' : noOfSeats, 10);
  }, [noOfSeats]);

  const buttonLabel = useMemo(() => {
    return isAddingSeats ? textForKey('add_seats') : textForKey('remove_seats');
  }, [isAddingSeats]);

  const totalCharge = useMemo(() => {
    return Math.trunc(costOfOneSeat * parseInt(noOfSeats || '0'));
  }, [costOfOneSeat, noOfSeats]);

  const paymentLabel = useMemo(() => {
    const { nextCurrency } = subscription;
    if (isAddingSeats) {
      return textForKey(
        'payment_info',
        formatAmountWithSymbol(totalCharge, nextCurrency),
        noOfSeats,
        subscription.totalSeats + parsedNoOfSeats,
      ) as string;
    } else {
      return textForKey(
        'payment_removal',
        noOfSeats,
        subscription.totalSeats - parsedNoOfSeats,
      );
    }
  }, [noOfSeats, costOfOneSeat, totalCharge]);

  const nextPaymentLabel = useMemo(() => {
    const { nextCurrency } = subscription;
    let nextFullAmount: number;
    const seatCount = isAddingSeats
      ? subscription.totalSeats + parsedNoOfSeats
      : subscription.totalSeats - parsedNoOfSeats;

    if (subscription.interval === 'MONTH') {
      nextFullAmount = seatCount * costOfOneMonthMonthPlan;
    } else {
      nextFullAmount = seatCount * costOfOneMonthYearPlan * 12;
    }
    return textForKey(
      'next_payment_info',
      formatAmountWithSymbol(nextFullAmount, nextCurrency),
      paymentDueString,
    );
  }, [noOfSeats, subscription.nextPayment, subscription.interval]);

  const seatRemovalNotice = useMemo(() => {
    return textForKey('remove_notice', doctors.length) as string;
  }, []);

  const seatRemovalTakeEffectNotice = useMemo(() => {
    return textForKey('removal_date_notice', paymentDueString) as string;
  }, []);

  const taxAndProratiedInfo = useMemo(() => {
    const oneMothPrice =
      subscription.interval === 'MONTH'
        ? costOfOneMonthMonthPlan
        : costOfOneMonthYearPlan;

    return textForKey(
      'tax_prorated_info',
      formatAmountWithSymbol(oneMothPrice, subscription.nextCurrency),
      timeLeftTillPaymentDue,
    );
  }, []);

  const isSubmitDisabled = useMemo(() => {
    return (
      parsedNoOfSeats < 1 ||
      (!isAddingSeats && parsedNoOfSeats > subscription.availableSeats)
    );
  }, [parsedNoOfSeats, subscription.availableSeats, isAddingSeats]);

  const handleSeats = () => {
    if (!paymentMethods || paymentMethods.length === 0) {
      dispatch(openNewCardModal());
      return;
    }
    if (isAddingSeats) {
      dispatch(
        dispatchPurchaseSeats({
          seats: parseInt(noOfSeats),
          interval: 'MONTH',
        }),
      );
    } else {
      dispatch(dispatchRemoveSeats({ seats: parseInt(noOfSeats) }));
    }
  };

  const handleUpdateSeatsInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const parsedValue = parseInt(evt.target.value, 10);
    if (parsedValue < 1) setNoOfSeats('1');
    if (!isAddingSeats && parsedValue > subscription.availableSeats)
      setNoOfSeats(String(subscription.availableSeats));
    else setNoOfSeats(evt.target.value);
  };

  return (
    <div className={styles.wrapper}>
      {!isAddingSeats && <div className={styles.divider} />}
      {!isAddingSeats && (
        <>
          <Typography>{seatRemovalNotice}</Typography>
          <Typography>{seatRemovalTakeEffectNotice}</Typography>
        </>
      )}
      <div className={styles.divider} />
      <div className={clsx([styles.flexWrapper, styles.spread])}>
        <div className={styles.flexWrapper}>
          <div className={styles.flexWrapper}>
            {!isAddingSeats && (
              <Typography>
                {subscription.totalSeats} {textForKey('seats')}{' '}
                {String.fromCharCode(8594)}
              </Typography>
            )}
            <Box width='150px'>
              <TextField
                type={'number'}
                value={noOfSeats}
                fullWidth
                onChange={handleUpdateSeatsInputChange}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: isAddingSeats
                      ? undefined
                      : subscription.availableSeats,
                  },
                }}
              />
            </Box>
          </div>
          {isAddingSeats && <Typography>{taxAndProratiedInfo}</Typography>}
        </div>
        {isAddingSeats && <Typography>{costOfOneSeat}€</Typography>}
      </div>
      <div className={styles.divider} />
      {isAddingSeats && (
        <div className={clsx([styles.flexWrapper, styles.spread])}>
          <Typography variant={'bodySmall'}>Total:</Typography>
          <Typography>{totalCharge}€</Typography>
        </div>
      )}
      {isAddingSeats && <div className={styles.divider} />}
      <div>
        <Typography variant='bodyXSmall'>{paymentLabel}</Typography>
        <Typography variant='bodyXSmall'>{nextPaymentLabel}</Typography>
      </div>
      <div className={styles.btnWrapper}>
        <LoadingButton
          label={buttonLabel}
          variant={'contained'}
          onClick={handleSeats}
          loading={isDataLoading}
          disabled={isSubmitDisabled}
        />
        <Button
          label={textForKey('cancel')}
          onClick={onCancel}
          variant={'outlined'}
        />
      </div>
    </div>
  );
};

export default SeatsManagement;
