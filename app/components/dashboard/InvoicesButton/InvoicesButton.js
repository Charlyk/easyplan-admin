import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setPaymentModal } from '../../../../redux/actions/actions';
import { updateInvoicesSelector } from '../../../../redux/selectors/rootSelector';
import {
  totalInvoicesSelector,
  updateInvoiceSelector
} from "../../../../redux/selectors/invoicesSelector";
import formattedAmount from '../../../../utils/formattedAmount';
import getClinicExchangeRates from '../../../../utils/getClinicExchangeRates';
import areComponentPropsEqual from "../../../utils/areComponentPropsEqual";
import { textForKey } from '../../../../utils/localization';
import { setTotalInvoices } from "../../../../redux/actions/invoiceActions";
import { fetchPendingInvoices } from "../../../../middleware/api/invoices";
import styles from './InvoicesButton.module.scss';

const NewInvoiceToast = dynamic(() => import('../../../../components/common/NewInvoiceToast'));

const InvoicesButton = ({ currentUser, currentClinic }) => {
  const dispatch = useDispatch();
  const updateInvoices = useSelector(updateInvoicesSelector);
  const updateInvoice = useSelector(updateInvoiceSelector);
  const totalInvoices = useSelector(totalInvoicesSelector);
  const buttonRef = useRef(null);
  const clinicCurrency = currentClinic.currency;
  const userClinic = currentUser.clinics.find(clinic => clinic.clinicId === currentClinic.id);
  const exchangeRates = getClinicExchangeRates(currentClinic);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);

  useEffect(() => {
    if (userClinic?.canRegisterPayments) {
      fetchInvoices();
    }
  }, [updateInvoices, updateInvoice, exchangeRates]);

  const fetchInvoices = async () => {
    if (exchangeRates.length === 0 || isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchPendingInvoices();
      const { data: newInvoices } = response;
      if (newInvoices?.length > totalInvoices) {
        toast(<NewInvoiceToast />);
        dispatch(setTotalInvoices(newInvoices.length));
      }
      setInvoices(newInvoices);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleInvoices = () => {
    if (invoices.length === 0 || isLoading) return;
    setShowInvoices(!showInvoices);
  };

  const handleCloseInvoices = () => {
    setShowInvoices(false);
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

export default React.memo(InvoicesButton, areComponentPropsEqual);
