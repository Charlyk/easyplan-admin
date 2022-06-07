import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import formattedAmount from 'app/utils/formattedAmount';
import { setPaymentModal } from 'redux/actions/actions';
import { clinicExchangeRatesSelector } from 'redux/selectors/appDataSelector';
import styles from './InvoicesButton.module.scss';
import { invoicesButtonSelector } from './InvoicesButton.selector';
import { fetchInvoicesList } from './InvoicesButton.slice';

const InvoicesButton = ({ currentUser, currentClinic }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const { invoices, isLoading } = useSelector(invoicesButtonSelector);
  const buttonRef = useRef(null);
  const clinicCurrency = currentClinic.currency;
  const userClinic = currentUser.clinics.find(
    (clinic) => clinic.clinicId === currentClinic.id,
  );
  const exchangeRates = useSelector(clinicExchangeRatesSelector);
  const [isMounted, setIsMounted] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (
      !isMounted ||
      !userClinic?.canRegisterPayments ||
      exchangeRates.length === 0
    ) {
      return;
    }

    dispatch(fetchInvoicesList());
  }, [isMounted, userClinic, exchangeRates]);

  const handleToggleInvoices = () => {
    if (invoices.length === 0 || isLoading) return;
    if (isMounted) setShowInvoices(!showInvoices);
  };

  const handleCloseInvoices = () => {
    if (isMounted) setShowInvoices(false);
  };

  const handlePayInvoice = (invoice) => {
    dispatch(setPaymentModal({ open: true, invoice, schedule: null }));
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
                    <td>{textForKey('doctor')}</td>
                    <td>{textForKey('patient')}</td>
                    <td align='right'>{textForKey('amount')}</td>
                    <td align='right'>{textForKey('actions')}</td>
                  </tr>
                </thead>
                <tbody>
                  {invoices?.map((invoice) => (
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
                          {textForKey('pay')}
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
    <Box
      className={styles['invoices-button-root']}
      ref={buttonRef}
      onClick={handleToggleInvoices}
    >
      <span className={styles['button-text']}>
        {textForKey('for payment')} ({invoices?.length || 0})
      </span>
      {invoicesPaper}
    </Box>
  );
};

export default React.memo(InvoicesButton, areComponentPropsEqual);
