import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import './styles.scss';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { setPaymentModal } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';

import { ClickAwayListener, Fade, Paper, Popper } from '@material-ui/core';

const InvoicesButton = props => {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [props]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchClinicInvoices();
    if (response.isError) {
      console.error(response.message);
    } else {
      setInvoices(response.data);
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

  const handlePayInvoice = invoice => {
    dispatch(setPaymentModal({ open: true, invoice }));
  };

  const invoicesPaper = (
    <Popper
      className='invoices-popper-root'
      anchorEl={buttonRef.current}
      open={showInvoices}
      placement='bottom'
      disablePortal
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='invoices-paper'>
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
                  {invoices.map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.doctorName}</td>
                      <td>{invoice.patientName}</td>
                      <td align='right'>{invoice.amount - invoice.paid} MDL</td>
                      <td align='right'>
                        <Button
                          className='positive-button'
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
      className='invoices-button-root'
      ref={buttonRef}
      onClick={handleToggleInvoices}
    >
      {isLoading && <Spinner animation='border' />}
      {!isLoading && (
        <span className='button-text'>
          {textForKey('For payment')} ({invoices.length})
        </span>
      )}
      {invoicesPaper}
    </div>
  );
};

export default InvoicesButton;
