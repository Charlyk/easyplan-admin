import React, { useContext, useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { fetchPendingInvoices } from 'middleware/api/invoices';
import { setPaymentModal } from 'redux/actions/actions';
import { setTotalInvoices } from 'redux/actions/invoiceActions';
import { clinicExchangeRatesSelector } from 'redux/selectors/appDataSelector';
import {
  totalInvoicesSelector,
  updateInvoiceSelector,
} from 'redux/selectors/invoicesSelector';
import { updateInvoicesSelector } from 'redux/selectors/rootSelector';
import styles from './InvoicesButton.module.scss';

const InvoicesButton = ({ currentUser, currentClinic }) => {
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const updateInvoices = useSelector(updateInvoicesSelector);
  const updateInvoice = useSelector(updateInvoiceSelector);
  const totalInvoices = useSelector(totalInvoicesSelector);
  const buttonRef = useRef(null);
  const clinicCurrency = currentClinic.currency;
  const userClinic = currentUser.clinics.find(
    (clinic) => clinic.clinicId === currentClinic.id,
  );
  const exchangeRates = useSelector(clinicExchangeRatesSelector);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !userClinic?.canRegisterPayments) {
      return;
    }

    fetchInvoices();
  }, [updateInvoices, updateInvoice, exchangeRates, isMounted]);

  const fetchInvoices = async () => {
    if (exchangeRates.length === 0 || isLoading) {
      return;
    }
    if (isMounted) setIsLoading(true);
    try {
      const response = await fetchPendingInvoices();
      const { data: newInvoices } = response;
      if (newInvoices?.length > totalInvoices) {
        toast.success(textForKey('invoice_created'));
        dispatch(setTotalInvoices(newInvoices.length));
      }
      if (isMounted) setInvoices(newInvoices);
    } catch (error) {
      toast.error(error.message);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

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
                    <td>{textForKey('Doctor')}</td>
                    <td>{textForKey('Patient')}</td>
                    <td align='right'>{textForKey('Amount')}</td>
                    <td align='right'>{textForKey('Actions')}</td>
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
    <Box
      className={styles['invoices-button-root']}
      ref={buttonRef}
      onClick={handleToggleInvoices}
    >
      <span className={styles['button-text']}>
        {textForKey('For payment')} ({invoices?.length || 0})
      </span>
      {invoicesPaper}
    </Box>
  );
};

export default React.memo(InvoicesButton, areComponentPropsEqual);
