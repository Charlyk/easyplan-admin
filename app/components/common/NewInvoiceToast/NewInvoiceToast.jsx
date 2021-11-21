import React from 'react';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { textForKey } from 'app/utils/localization';
import styles from './NewInvoiceToast.module.scss';

const NewInvoiceToast = () => {
  return (
    <div className={styles['invoice-toast-root']}>
      <Image src='/icon_invoice.png' alt='New invoice' width={30} height={30} />
      <Typography>{textForKey('invoice_created')}</Typography>
    </div>
  );
};

export default NewInvoiceToast;
