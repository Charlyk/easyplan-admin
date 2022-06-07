import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import { useTranslate } from 'react-polyglot';
import styles from './InfoContainer.module.scss';

const InfoContainer = () => {
  const textForKey = useTranslate();
  return (
    <div className={styles.wrapper}>
      <Typography>
        {textForKey('transaction_unsuccessful')}. {textForKey('go_to')}{' '}
        <Link href={'/settings/billing-details'}>
          <a>{textForKey('billing_details')}</a>
        </Link>
      </Typography>
    </div>
  );
};

export default InfoContainer;
