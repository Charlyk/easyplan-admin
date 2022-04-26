import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './BillingDetails.module.scss';
import { BillingDetailsViewMode } from './BillingDetails.types';

const PaymentHistory = dynamic(() => import('./Views/PaymentHistory'));
const PaymentMethods = dynamic(() => import('./Views/PaymentMethods'));
const SeatsManagement = dynamic(() => import('./Views/SeatsManagement'));

const BillingDetails: React.FC = () => {
  const [selectedView, setSelectedView] =
    useState<BillingDetailsViewMode>('payment-history');

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
            12$
          </Typography>
          <Link href='manage-seats'>
            <Typography classes={{ root: styles.infoBoxLink }}>
              Manage Seats
            </Typography>
          </Link>
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
            11 May
          </Typography>
          <Link href='yearly-plan'>
            <Typography classes={{ root: styles.infoBoxLink }}>
              Switch to yearly plan and save
            </Typography>
          </Link>
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
            **** **** **** 8283 10/25
          </Typography>
          <Link href='manage-seats'>
            <Typography classes={{ root: styles.infoBoxLink }}>
              Manage Payment Method
            </Typography>
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        {selectedView === 'payment-history' && <PaymentHistory />}
        {selectedView === 'payment-method' && <PaymentMethods />}
        {selectedView === 'manage-seats' && <SeatsManagement />}
      </div>
    </div>
  );
};

export default BillingDetails;
