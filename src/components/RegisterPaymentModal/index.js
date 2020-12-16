import React, { useEffect, useState } from 'react';

import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import {
  toggleAppointmentsUpdate,
  togglePatientPaymentsUpdate,
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
    invoice?.remainedAmount ? String(invoice.remainedAmount) : '0',
  );
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    if (invoice != null) {
      setPayAmount(String(invoice.remainedAmount));
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
      newValue = String(invoice?.remainedAmount);
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
    const fixedDiscount = discount.length === 0 ? '0' : discount;
    if (payAmount.length === 0) {
      const discountAmount =
        (parseInt(fixedDiscount) / 100) * parseFloat(payAmount);
      return payAmount - discountAmount;
    }
    const amount = invoice?.remainedAmount || 0;
    const discountAmount = (parseInt(fixedDiscount) / 100) * parseFloat(amount);
    return payAmount - discountAmount;
  };

  const isFormValid = () => {
    return payAmount.length > 0;
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
      toast.error(textForKey(response.message));
    } else {
      dispatch(toggleAppointmentsUpdate());
      dispatch(toggleUpdateInvoices());
      dispatch(togglePatientPaymentsUpdate());
      onClose();
    }

    setIsLoading(false);
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
          <span className='content-text'>{invoice?.doctor.fullName}</span>
        </div>
        <div className='content-row'>
          <span className='title-text'>{textForKey('Patient')}:</span>
          <span className='content-text'>{invoice?.patient}</span>
        </div>
        <div className='services-wrapper'>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Services')}</span>
          </div>
          <table>
            <tbody>
              {invoice?.services.map(service => (
                <tr key={service.id}>
                  <td>
                    <Typography classes={{ root: 'service-name-label' }}>{`${
                      service.name
                    } ${service.toothId || ''}`}</Typography>
                  </td>
                  <td align='right'>
                    <Typography classes={{ root: 'service-price-label' }}>
                      {service.price} MDL
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='content-row'>
          <span className='title-text'>{textForKey('For payment')}:</span>
          <FormControl
            type='number'
            max={invoice?.remainedAmount}
            onChange={handleAmountChange}
            value={String(payAmount)}
          />
          <span className='content-text'>
            {textForKey('from')} {invoice?.remainedAmount || 0}
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
    id: PropTypes.number,
    doctor: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    scheduleId: PropTypes.number,
    patient: PropTypes.string,
    totalAmount: PropTypes.number,
    paidAmount: PropTypes.number,
    remainedAmount: PropTypes.number,
    services: PropTypes.arrayOf(PropTypes.object),
  }),
  onClose: PropTypes.func,
};
