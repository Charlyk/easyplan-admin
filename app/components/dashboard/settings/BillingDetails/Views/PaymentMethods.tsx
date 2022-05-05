import React, { useState } from 'react';
import { Button } from '@easyplanpro/easyplan-components';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import amex from 'public/images/cards/amex.png';
import diners from 'public/images/cards/diners.png';
import discover from 'public/images/cards/discover.png';
import jcb from 'public/images/cards/jcb.png';
import mastercard from 'public/images/cards/mastercard.jpg';
import unionpay from 'public/images/cards/unionpay.png';
import visa from 'public/images/cards/visa.png';
import {
  paymentsNewCardModalSelector,
  paymentsPaymentMethodsSelector,
} from 'redux/selectors/paymentsSelector';
import {
  dispatchDeletePaymentMethod,
  dispatchSetPaymentMethodAsDefault,
  openNewCardModal,
} from 'redux/slices/paymentSlice';
import { PaymentMethod as PaymentMethodType } from 'types/api';
import { Country } from 'types/api';
import NewCardModal from '../NewCardModal';
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

const PaymentMethods: React.FC<Props> = ({ countries }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(paymentsPaymentMethodsSelector);
  const modalOpen = useSelector(paymentsNewCardModalSelector);

  const handleOpenModal = () => dispatch(openNewCardModal());

  const handleDelete = (id: string) =>
    dispatch(dispatchDeletePaymentMethod({ id }));

  const handleSetAsDefault = (id: string) =>
    dispatch(dispatchSetPaymentMethodAsDefault({ id }));

  return (
    <>
      <div className={styles.wrapper}>
        {data.map((method) => (
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
      {modalOpen && <NewCardModal countries={countries} />}
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
        <Image src={imagesMap[brand]} width={80} height={50} />
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
