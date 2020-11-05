import React, { useEffect, useState } from 'react';

import sum from 'lodash/sum';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import {
  toggleAppointmentsUpdate,
  toggleUpdateInvoices,
} from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const RegisterPaymentModal = ({ open, invoice, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [payAmount, setPayAmount] = useState(
    invoice?.amount ? String(invoice.amount - invoice.paid) : '0',
  );
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    if (invoice != null) {
      setPayAmount(String(invoice.amount - invoice.paid));
      setDiscount(invoice.discount ? String(invoice.discount) : '');
    }
  }, [invoice]);

  useEffect(() => {
    if (!open) {
      setIsLoading(false);
      setPayAmount('');
      setDiscount('');
    }
  }, [open]);

  const handleAmountChange = event => {
    let newValue = event.target.value;
    if (newValue.length > 0 && parseFloat(newValue) > invoice?.amount) {
      newValue = String(invoice?.amount);
    }
    setPayAmount(newValue);
  };

  const handleDiscountChange = event => {
    let newValue = event.target.value;
    if (newValue.length > 0 && parseInt(newValue) > 100) {
      newValue = String(100);
    }
    setDiscount(newValue);
  };

  const getTotal = () => {
    if (discount.length === 0 || payAmount.length === 0) {
      return payAmount;
    }
    const amount = sum(invoice?.services.map(item => item.price) || [0]);
    const discountAmount = (parseInt(discount) / 100) * parseFloat(amount || 0);
    return payAmount - discountAmount;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || invoice == null) {
      return;
    }
    setIsLoading(true);
    const response = await dataAPI.registerPayment({
      invoiceId: invoice.id,
      amount: parseFloat(payAmount),
      discount: parseInt(discount),
    });
    if (response.isError) {
      console.log(response.message);
    } else {
      dispatch(toggleAppointmentsUpdate());
      dispatch(toggleUpdateInvoices());
      onClose();
    }

    setIsLoading(false);
  };

  const isFormValid = () => {
    return payAmount.length > 0;
  };

  return (
    <EasyPlanModal
      className='register-payment-modal'
      title={textForKey('Register payment')}
      open={open}
      onClose={onClose}
      isPositiveLoading={isLoading}
      onPositiveClick={handleSubmit}
      isPositiveDisabled={!isFormValid()}
      positiveBtnText={textForKey('Submit')}
    >
      <div className='register-payment-content'>
        <div className='content-row'>
          <span className='title-text'>{textForKey('Doctor')}:</span>
          <span className='content-text'>{invoice?.doctorName}</span>
        </div>
        <div className='content-row'>
          <span className='title-text'>{textForKey('Patient')}:</span>
          <span className='content-text'>{invoice?.patientName}</span>
        </div>
        <div className='content-row'>
          <span className='title-text'>{textForKey('For payment')}:</span>
          <FormControl
            type='number'
            max={invoice?.amount ? invoice.amount - invoice.paid : 0}
            onChange={handleAmountChange}
            value={String(payAmount)}
          />
          <span className='content-text'>
            {textForKey('from')} {invoice?.amount - invoice?.paid}
          </span>
        </div>
        <div className='content-row'>
          <span className='title-text'>{textForKey('Discount')}:</span>
          <FormControl
            type='number'
            max={100}
            onChange={handleDiscountChange}
            value={String(discount)}
          />
          <span className='content-text'>%</span>
        </div>
        <div className='content-row'>
          <span className='title-text'>{textForKey('Total')}:</span>
          <span className='content-text'>{getTotal()}</span>
        </div>
      </div>
    </EasyPlanModal>
  );
};

export default RegisterPaymentModal;

RegisterPaymentModal.propTypes = {
  open: PropTypes.bool,
  invoice: PropTypes.shape({
    id: PropTypes.string,
    doctorId: PropTypes.string,
    doctorName: PropTypes.string,
    patientId: PropTypes.string,
    patientName: PropTypes.string,
    scheduleId: PropTypes.string,
    amount: PropTypes.number,
    status: PropTypes.string,
    paid: PropTypes.number,
    discount: PropTypes.number,
    services: PropTypes.arrayOf(PropTypes.object),
  }),
  onClose: PropTypes.func,
};
