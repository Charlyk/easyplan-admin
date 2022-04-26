import React from 'react';
import { Button } from '@easyplanpro/easyplan-components';
import Typography from '@material-ui/core/Typography';
// import { useSelector } from 'react-redux';
// import { paymentsPaymentMethodsSelector } from 'redux/selectors/paymentsSelector';
import { textForKey } from 'app/utils/localization';
import { PaymentMethod } from 'types/api';
import styles from './ViewStyles/PaymentMethods.module.scss';

const data = [
  {
    id: 'asdweed',
    last4: '4242',
    brand: 'visa',
    expMonth: 4,
    expYear: 2023,
    isDefault: true,
  },
  {
    id: 'asdw',
    last4: '5252',
    brand: 'visa',
    expMonth: 9,
    expYear: 2028,
    isDefault: false,
  },
];

const PaymentMethods = () => {
  // const { data } = useSelector(paymentsPaymentMethodsSelector);
  return (
    <div className={styles.wrapper}>
      {data.map((method) => (
        <PaymentMethod {...method} key={method.id} />
      ))}
    </div>
  );
};

export default PaymentMethods;

const PaymentMethod: React.FC<PaymentMethod> = ({
  last4,
  brand,
  expMonth,
  expYear,
  isDefault,
}) => {
  return (
    <div className={styles.paymentMethod}>
      {isDefault ? (
        <Typography classes={{ root: styles.default }}>
          {textForKey('default_card')}
        </Typography>
      ) : (
        <>
          <Button label='Set as Default' className={styles.default} />
          <Button label={'Delete'} className={styles.delete} />
        </>
      )}
      <Typography classes={{ root: styles.brand }}>{brand}</Typography>
      <Typography classes={{ root: styles.number }}>
        **** **** **** {last4}
      </Typography>
      <Typography classes={{ root: styles.expiration }}>
        {expMonth}/{expYear}
      </Typography>
    </div>
  );
};
