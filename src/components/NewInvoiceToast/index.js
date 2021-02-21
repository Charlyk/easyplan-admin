import React from 'react';

import { Typography } from '@material-ui/core';
import { textForKey } from '../../utils/localization';
import styles from './NewInvoiceToast.module.scss'

const NewInvoiceToast = () => {
  return (
    <div className={styles['invoice-toast-root']}>
      <img className={styles['invoice-icon']} src='/icon_invoice.png' alt='New invoice' />
      <Typography>{textForKey('invoice_created')}</Typography>
    </div>
  );
};

export default NewInvoiceToast;
