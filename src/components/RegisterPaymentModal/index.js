import React, { useEffect, useReducer } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import {
  toggleAppointmentsUpdate,
  togglePatientPaymentsUpdate,
  toggleUpdateInvoices,
} from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { generateReducerActions, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const initialState = {
  isLoading: false,
  isFetching: true,
  payAmount: '0',
  discount: '0',
  services: [],
  showConfirmationMenu: false,
  invoiceStatus: 'PendingPayment',
  invoiceDetails: null,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setPayAmount: 'setPayAmount',
  setDiscount: 'setDiscount',
  setupInvoiceData: 'setupInvoiceData',
  resetState: 'resetState',
  setServices: 'setServices',
  setShowConfirmationMenu: 'setShowConfirmationMenu',
  setInvoiceStatus: 'setInvoiceStatus',
  setIsFetching: 'setIsFetching',
};

const actions = generateReducerActions(reducerTypes);

/**
 * Payment modal reducer
 * @param {Object} state
 * @param {{ type: string, payload: any}} action
 */
const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setPayAmount:
      return { ...state, payAmount: action.payload };
    case reducerTypes.setDiscount:
      return { ...state, discount: action.payload };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setShowConfirmationMenu:
      return { ...state, showConfirmationMenu: action.payload };
    case reducerTypes.setInvoiceStatus:
      return { ...state, invoiceStatus: action.payload };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setupInvoiceData:
      return {
        ...state,
        invoiceDetails: action.payload,
        payAmount: action.payload.remainedAmount,
        discount: action.payload.discount,
        services: action.payload.services,
        invoiceStatus: action.payload.status,
      };
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};

const RegisterPaymentModal = ({ open, invoice, onClose }) => {
  const dispatch = useDispatch();
  const [
    {
      isLoading,
      payAmount,
      discount,
      services,
      invoiceStatus,
      invoiceDetails,
      showConfirmationMenu,
      isFetching,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const totalAmount = sumBy(services, item => item.totalPrice);

  useEffect(() => {
    if (invoice != null) {
      fetchInvoiceDetails();
    }
  }, [invoice]);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  const fetchInvoiceDetails = async () => {
    if (invoice == null) {
      return;
    }
    localDispatch(actions.setIsFetching(true));
    const response = await dataAPI.fetchInvoiceDetails(invoice.id);
    if (response.isError) {
      toast(textForKey(response.message));
    } else {
      const { data: invoiceDetails } = response;
      localDispatch(actions.setupInvoiceData(invoiceDetails));
    }
    localDispatch(actions.setIsFetching(false));
  };

  const adjustValueToNumber = (newValue, maxAmount) => {
    if (newValue.length === 0) {
      newValue = '0';
    }

    if (newValue.length > 1 && newValue[0] === '0') {
      newValue = newValue.replace(/^./, '');
    }

    newValue = parseFloat(newValue);

    if (newValue > maxAmount) {
      newValue = maxAmount;
    }
    return newValue;
  };

  const handleAmountChange = event => {
    let newValue = adjustValueToNumber(
      event.target.value,
      invoice?.status === 'PendingPayment'
        ? totalAmount
        : invoice?.remainedAmount || 0,
    );
    localDispatch(actions.setPayAmount(String(newValue)));
  };

  const handleDiscountChange = event => {
    let newValue = adjustValueToNumber(event.target.value, 100);
    localDispatch(actions.setDiscount(String(newValue)));
  };

  const handleServicePriceChanged = service => event => {
    const newValue = adjustValueToNumber(event.target.value, Number.MAX_VALUE);
    const newServices = services.map(item => {
      if (
        item.id !== service.id ||
        item.toothId !== service.toothId ||
        item.destination !== item.destination
      ) {
        return item;
      }

      return {
        ...item,
        totalPrice: newValue,
      };
    });
    localDispatch(actions.setServices(newServices));
  };

  const getTotal = () => {
    if (payAmount.length === 0) {
      const discountAmount = (parseInt(discount) / 100) * parseFloat(payAmount);
      return payAmount - discountAmount;
    }
    const discountAmount = parseFloat(totalAmount) * (parseInt(discount) / 100);
    return payAmount - discountAmount;
  };

  const handleSubmitPayment = () => {
    localDispatch(actions.setShowConfirmationMenu(true));
  };

  const handleCloseConfirmationMenu = () => {
    localDispatch(actions.setShowConfirmationMenu(false));
  };

  const handleSubmit = async () => {
    if (invoice == null) {
      return;
    }
    const requestBody = {
      invoiceId: invoice.id,
      amount: parseFloat(payAmount),
      discount: parseInt(discount),
      services: services.map(item => ({
        id: item.id,
        finalPrice: item.totalPrice,
      })),
    };
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.registerPayment(requestBody);
    if (response.isError) {
      toast.error(textForKey(response.message));
      logUserAction(Action.PayInvoice, JSON.stringify(response));
    } else {
      logUserAction(Action.PayInvoice, JSON.stringify(requestBody));
      dispatch(toggleAppointmentsUpdate());
      dispatch(toggleUpdateInvoices());
      dispatch(togglePatientPaymentsUpdate());
      onClose();
    }
    localDispatch(actions.setIsLoading(false));
  };

  const confirmationMenu = (
    <div className='confirmation-container'>
      <div className='confirmation-menu'>
        <Box
          display='flex'
          flexDirection='column'
          width='100%'
          height='100%'
          alignItems='center'
          justifyContent='center'
        >
          <Typography classes={{ root: 'amount-title' }}>
            {textForKey('For payment')}:
          </Typography>
          <Typography classes={{ root: 'amount-label' }}>
            {getTotal()} MDL
          </Typography>
        </Box>
        <Box
          display='flex'
          alignItems='center'
          width='100%'
          height='35px'
          justifyContent='space-between'
        >
          <Button
            style={{ marginRight: '.5rem' }}
            className='cancel-button'
            onClick={handleCloseConfirmationMenu}
          >
            {textForKey('Edit')}
          </Button>
          <Button className='positive-button' onClick={handleSubmit}>
            {textForKey('Pay')}
          </Button>
        </Box>
      </div>
    </div>
  );

  return (
    <EasyPlanModal
      className='register-payment-modal'
      title={textForKey('Register payment')}
      open={open}
      onClose={onClose}
      isPositiveLoading={isLoading || isFetching}
      isPositiveDisabled={isLoading || isFetching}
      onPositiveClick={handleSubmitPayment}
      positiveBtnText={textForKey('Submit')}
    >
      {showConfirmationMenu && confirmationMenu}
      {isFetching && (
        <div className='register-payment-loading'>
          <CircularProgress classes={{ root: 'register-payment-progress' }} />
        </div>
      )}
      {!isFetching && (
        <div className='register-payment-content'>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Doctor')}:</span>
            <span className='content-text'>
              {invoiceDetails?.doctor.fullName}
            </span>
          </div>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Patient')}:</span>
            <span className='content-text'>{invoiceDetails?.patient}</span>
          </div>
          <div className='services-wrapper'>
            <div className='content-row'>
              <span className='title-text'>{textForKey('Services')}</span>
            </div>
            <table>
              <tbody>
                {services.map(service => (
                  <tr key={service.id}>
                    <td>
                      <Typography classes={{ root: 'service-name-label' }}>{`${
                        service.name
                      } ${service.toothId || ''}`}</Typography>
                    </td>
                    <td align='right' valign='middle'>
                      <InputGroup>
                        <Form.Control
                          disabled={invoiceDetails?.status !== 'PendingPayment'}
                          onChange={handleServicePriceChanged(service)}
                          type='number'
                          value={String(service.totalPrice)}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id='basic-addon1'>
                            MDL
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='content-row'>
            <span className='title-text'>{textForKey('For payment')}:</span>
            <InputGroup>
              <FormControl
                type='number'
                max={totalAmount}
                onChange={handleAmountChange}
                value={String(payAmount)}
              />
              <InputGroup.Append>
                <InputGroup.Text id='basic-addon1'>MDL</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <span className='total-label'>
              {textForKey('from')}{' '}
              {invoiceStatus === 'PendingPayment'
                ? totalAmount
                : invoiceDetails?.remainedAmount || 0}
            </span>
          </div>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Discount')}:</span>
            <InputGroup>
              <FormControl
                className='discount-form-control'
                type='number'
                max={100}
                onChange={handleDiscountChange}
                value={String(discount)}
              />
              <InputGroup.Append>
                <InputGroup.Text id='basic-addon1'>%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Total')}:</span>
            <span className='total-label'>{getTotal()} MDL</span>
          </div>
        </div>
      )}
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
    status: PropTypes.oneOf(['PendingPayment', 'Paid', 'PartialPaid']),
  }),
  onClose: PropTypes.func,
};
