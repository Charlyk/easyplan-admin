import React from 'react';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { useTranslate } from 'react-polyglot';
import styles from './NewInvoiceToast.module.scss';

const NewInvoiceToast = () => {
  const textForKey = useTranslate();
  return (
    <div className={styles['invoice-toast-root']}>
      <Image src='/icon_invoice.png' alt='New invoice' width={30} height={30} />
      <Typography>{textForKey('invoice_created')}</Typography>
    </div>
  );
};

export default NewInvoiceToast;
