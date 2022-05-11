import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import { textForKey } from 'app/utils/localization';
import styles from './InfoContainer.module.scss';

const InfoContainer = () => {
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
