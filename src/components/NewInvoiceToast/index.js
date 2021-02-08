import React from 'react';

import { Typography } from '@material-ui/core';

import invoiceIcon from '../../assets/icons/icon_invoice.png';
import { textForKey } from '../../utils/localization';
import './styles.scss';

import './styles.scss';

const NewInvoiceToast = () => {
  return (
    <div className='invoice-toast-root'>
      <img className='invoice-icon' src={invoiceIcon} alt='New invoice' />
      <Typography>{textForKey('invoice_created')}</Typography>
    </div>
  );
};

export default NewInvoiceToast;
