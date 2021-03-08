import React, { useEffect, useReducer } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  toggleAppointmentsUpdate,
  togglePatientPaymentsUpdate,
  toggleUpdateInvoices,
} from '../../../redux/actions/actions';
import {
  clinicCurrencySelector,
  clinicExchangeRatesSelector,
} from '../../../redux/selectors/clinicSelector';
import { updateInvoicesSelector } from '../../../redux/selectors/rootSelector';
import dataAPI from '../../../utils/api/dataAPI';
import {
  adjustValueToNumber,
  formattedAmount,
  generateReducerActions,
  roundToTwo,
} from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../EasyPlanModal';
import './RegisterPaymentModal.module.scss';

const computeServicePrice = (invoice, exchangeRates) => {
  return invoice.services.map((service) => {
    const serviceExchange = exchangeRates.find(
      (rate) => rate.currency === service.currency,
    ) || { value: 1 };
    const servicePrice = service.amount * serviceExchange.value * service.count;
    return {
      ...service,
      created: moment(service.created).toDate(),
      totalPrice: roundToTwo(servicePrice),
    };
  });
};

const initialState = {
  isLoading: false,
  isFetching: true,
  isDebt: false,
  payAmount: '0',
  discount: '0',
  services: [],
  showConfirmationMenu: false,
  invoiceStatus: 'PendingPayment',
  invoiceDetails: null,
  totalAmount: 0,
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
    case reducerTypes.setDiscount: {
      // compute new total amount
      const newDiscount = action.payload;
      const servicesTotal = sumBy(state.services, (item) => item.totalPrice);
      const discountAmount = servicesTotal * (newDiscount / 100);
      let discountedTotal = servicesTotal - discountAmount;
      // check if discounted total is not less than 0 or not greater then total amount
      if (discountedTotal > servicesTotal) discountedTotal = servicesTotal;
      if (discountedTotal < 0) discountedTotal = 0;
      // check if current entered pay amount is not greater than discounted total
      let currentPayAmount = state.payAmount;
      if (currentPayAmount > discountedTotal) {
        currentPayAmount = discountedTotal;
      }
      return {
        ...state,
        discount: action.payload,
        totalAmount: roundToTwo(discountedTotal),
        payAmount: roundToTwo(currentPayAmount),
      };
    }
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setShowConfirmationMenu:
      return { ...state, showConfirmationMenu: action.payload };
    case reducerTypes.setInvoiceStatus:
      return { ...state, invoiceStatus: action.payload };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setupInvoiceData: {
      const { invoiceDetails, exchangeRates } = action.payload;
      const isDebt = invoiceDetails.status === 'PartialPaid';
      const updatedServices = computeServicePrice(
        invoiceDetails,
        exchangeRates,
      );
      const servicesPrice = parseFloat(
        sumBy(updatedServices, (item) => item.totalPrice),
      ).toFixed(2);
      return {
        ...state,
        invoiceDetails: {
          ...invoiceDetails,
          services: updatedServices,
        },
        payAmount: isDebt
          ? invoiceDetails.totalAmount - invoiceDetails.paidAmount
          : roundToTwo(servicesPrice - invoiceDetails.paidAmount),
        totalAmount: isDebt
          ? invoiceDetails.totalAmount - invoiceDetails.paidAmount
          : roundToTwo(servicesPrice),
        discount: invoiceDetails.discount,
        services: updatedServices,
        invoiceStatus: invoiceDetails.status,
        isDebt,
      };
    }
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
      totalAmount,
      isDebt,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const exchangeRates = useSelector(clinicExchangeRatesSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const updateInvoices = useSelector(updateInvoicesSelector);

  useEffect(() => {
    if (invoice != null) {
      fetchInvoiceDetails();
    }
  }, [invoice, exchangeRates, updateInvoices]);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  const fetchInvoiceDetails = async () => {
    if (invoice == null || exchangeRates.length === 0) {
      return;
    }
    localDispatch(actions.setIsFetching(true));
    const response = await dataAPI.fetchInvoiceDetails(invoice.id);
    if (response.isError) {
      toast(textForKey(response.message));
    } else {
      const { data: invoiceDetails } = response;
      localDispatch(
        actions.setupInvoiceData({ invoiceDetails, exchangeRates }),
      );
    }
    localDispatch(actions.setIsFetching(false));
  };

  const handleAmountChange = (event) => {
    let newValue = adjustValueToNumber(event.target.value, totalAmount);
    localDispatch(actions.setPayAmount(newValue));
  };

  const handleDiscountChange = (event) => {
    let newValue = adjustValueToNumber(event.target.value, 100.0);

    localDispatch(actions.setDiscount(newValue));
  };

  const handleSubmitPayment = () => {
    localDispatch(actions.setShowConfirmationMenu(true));
  };

  const handleCloseConfirmationMenu = () => {
    localDispatch(actions.setShowConfirmationMenu(false));
  };

  const handleSubmit = async () => {
    if (invoiceDetails == null) {
      return;
    }
    const requestBody = {
      paidAmount: payAmount,
      discount: discount,
    };
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.registerPayment(
      invoiceDetails.id,
      requestBody,
    );
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
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
            {formattedAmount(payAmount, clinicCurrency)}
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

  const getDateHour = (date) => {
    if (date == null) return '';
    return moment(date).format('DD MMM YYYY HH:mm');
  };

  const scheduleTime = `${getDateHour(
    invoiceDetails?.schedule.startTime,
  )} - ${getDateHour(invoiceDetails?.schedule.endTime)}`;

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
            <span className='content-text'>{invoiceDetails?.doctor.name}</span>
          </div>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Patient')}:</span>
            <span className='content-text'>{invoiceDetails?.patient.name}</span>
          </div>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Schedule time')}:</span>
            <span className='content-text'>{scheduleTime}</span>
          </div>
          <div className='services-wrapper'>
            <div className='content-row'>
              <span className='title-text'>{textForKey('Services')}</span>
            </div>
            <table>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <Typography classes={{ root: 'service-name-label' }}>{`${
                        service.name
                      } ${service.toothId || ''}`}</Typography>
                    </td>
                    <td align='right' valign='middle'>
                      <Typography classes={{ root: 'service-price-label' }}>
                        {formattedAmount(
                          service.amount * service.count,
                          service.currency,
                        )}
                      </Typography>
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
                id='paid-amount'
                type='number'
                step='any'
                max={totalAmount}
                onChange={handleAmountChange}
                value={String(payAmount)}
              />
              <InputGroup.Append>
                <InputGroup.Text>{clinicCurrency}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <span className='total-label'>
              {textForKey('from')}{' '}
              {invoiceStatus !== 'Paid'
                ? formattedAmount(totalAmount, clinicCurrency)
                : invoiceDetails?.remainedAmount || 0}
            </span>
          </div>
          <div className='content-row'>
            <span className='title-text'>{textForKey('Discount')}:</span>
            <InputGroup>
              <FormControl
                disabled={isDebt}
                id='discount'
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
            <span className='total-label'>
              {formattedAmount(payAmount, clinicCurrency)}
            </span>
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
    scheduleDate: PropTypes.string,
    paidAmount: PropTypes.number,
    status: PropTypes.oneOf(['PendingPayment', 'Paid', 'PartialPaid']),
    doctorFullName: PropTypes.string,
    patientFullName: PropTypes.string,
    services: PropTypes.arrayOf(PropTypes.object),
  }),
  onClose: PropTypes.func,
};
