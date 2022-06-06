import React, { useState } from 'react';
import { Button } from '@easyplanpro/easyplan-components';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Image from 'next/image';
import { useTranslate } from 'react-polyglot';
import { useSelector, useDispatch } from 'react-redux';
import amex from 'public/images/cards/amex.svg';
import diners from 'public/images/cards/diners.svg';
import discover from 'public/images/cards/discover.svg';
import jcb from 'public/images/cards/jcb.svg';
import mastercard from 'public/images/cards/mastercard.svg';
import unionpay from 'public/images/cards/unionpay.png';
import visa from 'public/images/cards/visa.svg';
import { paymentsPaymentMethodsSelector } from 'redux/selectors/paymentsSelector';
import {
  dispatchDeletePaymentMethod,
  dispatchSetPaymentMethodAsDefault,
  openNewCardModal,
} from 'redux/slices/paymentSlice';
import { PaymentMethod as PaymentMethodType } from 'types/api';
import { Country } from 'types/api';
import styles from './ViewStyles/PaymentMethods.module.scss';

const imagesMap = {
  amex,
  mastercard,
  diners,
  discover,
  jcb,
  unionpay,
  visa,
};

type Props = {
  countries: Country[];
};

const PaymentMethods: React.FC<Props> = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const { data } = useSelector(paymentsPaymentMethodsSelector);
  const handleOpenModal = () => dispatch(openNewCardModal());

  const handleDelete = (id: string) =>
    dispatch(dispatchDeletePaymentMethod({ id }));

  const handleSetAsDefault = (id: string) =>
    dispatch(dispatchSetPaymentMethodAsDefault({ id }));

  return (
    <>
      <div className={styles.wrapper}>
        {data &&
          data.map((method) => (
            <PaymentMethod
              {...method}
              key={method.id}
              onDelete={handleDelete}
              onSetAsDefault={handleSetAsDefault}
            />
          ))}
        <div className={styles.newMethod}>
          <Button
            label={textForKey('add_new_card')}
            variant={'outlined'}
            className={styles.button}
            size={'large'}
            onClick={handleOpenModal}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;

export const PaymentMethod: React.FC<
  PaymentMethodType & {
    onDelete?(id: string): void;
    onSetAsDefault?(id: string): void;
  }
> = ({
  id,
  last4,
  brand,
  holder,
  expMonth,
  expYear,
  isDefault,
  onDelete,
  onSetAsDefault,
}) => {
  const textForKey = useTranslate();
  const [showBtns, setShowBtns] = useState(false);

  const handlePointerEnter = () => setShowBtns(true);
  const handlePointerLeave = () => setShowBtns(false);

  return (
    <div
      className={clsx(styles.paymentMethod, {
        [styles.highlighted]: isDefault,
      })}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {!isDefault && showBtns && (
        <>
          <Button
            label={textForKey('set_as_default')}
            className={clsx(styles.default, styles.button)}
            onClick={() => onSetAsDefault(id)}
            variant={'outlined'}
          />
          <Button
            label={textForKey('delete')}
            className={clsx(styles.delete, styles.button)}
            onClick={() => onDelete(id)}
            variant={'outlined'}
          />
        </>
      )}
      <div className={styles.brand}>
        <Image src={imagesMap[brand]} width={100} height={60} />
      </div>
      <Typography classes={{ root: styles.number }}>
        **** **** **** {last4}
      </Typography>
      <Typography classes={{ root: styles.expiration }}>
        {expMonth}/{expYear}
      </Typography>
      <Typography classes={{ root: styles.holder }}>{holder}</Typography>
    </div>
  );
};
