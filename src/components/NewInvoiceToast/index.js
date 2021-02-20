import React from 'react';

import { Typography } from '@material-ui/core';

import Image from 'next/image'
import { textForKey } from '../../utils/localization';

const NewInvoiceToast = () => {
  return (
    <div className='invoice-toast-root'>
      <Image className='invoice-icon' layout='fill' src='/icon_invoice.png' alt='New invoice' />
      <Typography>{textForKey('invoice_created')}</Typography>
    </div>
  );
};

export default NewInvoiceToast;
