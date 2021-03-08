import React, { useEffect, useRef, useState } from 'react';

import styles from './InvoicesButton.module.scss';
import { ClickAwayListener, Fade, Paper, Popper } from '@material-ui/core';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setPaymentModal } from '../../../redux/actions/actions';
import {
  clinicCurrencySelector,
  clinicExchangeRatesSelector,
} from '../../../redux/selectors/clinicSelector';
import { updateInvoicesSelector } from '../../../redux/selectors/rootSelector';
import dataAPI from '../../../utils/api/dataAPI';
import { formattedAmount } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import NewInvoiceToast from '../NewInvoiceToast';

const InvoicesButton = () => {
  const dispatch = useDispatch();
  const updateInvoices = useSelector(updateInvoicesSelector);
  const buttonRef = useRef(null);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const exchangeRates = useSelector(clinicExchangeRatesSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [updateInvoices, exchangeRates]);

  const fetchInvoices = async () => {
    if (exchangeRates.length === 0 || isLoading) {
      return;
    }
    setIsLoading(true);
    const response = await dataAPI.fetchClinicInvoices();
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { data: newInvoices } = response;
      if (newInvoices?.length > invoices.length) {
        toast(<NewInvoiceToast />);
      }
      setInvoices(newInvoices);
    }
    setIsLoading(false);
  };

  const handleToggleInvoices = () => {
    if (invoices.length === 0 || isLoading) return;
    setShowInvoices(!showInvoices);
  };

  const handleCloseInvoices = () => {
    setShowInvoices(false);
  };

  const handlePayInvoice = (invoice) => {
    dispatch(setPaymentModal({ open: true, invoice }));
  };

  const invoicesPaper = (
    <Popper
      className={styles['invoices-popper-root']}
      anchorEl={buttonRef.current}
      open={showInvoices}
      placement='bottom'
      disablePortal
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles['invoices-paper']}>
            <ClickAwayListener onClickAway={handleCloseInvoices}>
              <table>
                <thead>
                  <tr>
                    <td>{textForKey('Doctor')}</td>
                    <td>{textForKey('Patient')}</td>
                    <td align='right'>{textForKey('Amount')}</td>
                    <td align='right'>{textForKey('Actions')}</td>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.doctorFullName}</td>
                      <td>{invoice.patientFullName}</td>
                      <td align='right'>
                        {formattedAmount(invoice.totalAmount, clinicCurrency)}
                      </td>
                      <td align='right'>
                        <Button
                          className={'positive-button'}
                          onClick={() => handlePayInvoice(invoice)}
                        >
                          {textForKey('Pay')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );

  return (
    <div
      role='button'
      tabIndex={0}
      className={styles['invoices-button-root']}
      ref={buttonRef}
      onClick={handleToggleInvoices}
    >
      <span className={styles['button-text']}>
        {textForKey('For payment')} ({invoices?.length || 0})
      </span>
      {invoicesPaper}
    </div>
  );
};

export default InvoicesButton;
