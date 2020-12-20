import React from 'react';

import invoiceIcon from '../../assets/icons/icon_invoice.png';

import './styles.scss';
import { Typography } from '@material-ui/core';

import { textForKey } from '../../utils/localization';

const NewInvoiceToast = () => {
  return (
    <div className='invoice-toast-root'>
      <img className='invoice-icon' src={invoiceIcon} alt='New invoice' />
      <Typography>{textForKey('invoice_created')}</Typography>
    </div>
  );
};

export default NewInvoiceToast;
