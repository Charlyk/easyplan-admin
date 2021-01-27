import React, { useCallback, useEffect, useReducer } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconClose from '../../assets/icons/iconClose';
import {
  setPatientDetails,
  toggleAppointmentsUpdate,
  togglePatientPaymentsUpdate,
  toggleUpdateInvoices,
} from '../../redux/actions/actions';
import {
  clinicActiveDoctorsSelector,
  clinicCurrencySelector,
  clinicExchangeRatesSelector,
} from '../../redux/selectors/clinicSelector';
import { updateInvoicesSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import {
  adjustValueToNumber,
  formattedAmount,
  generateReducerActions,
  roundToTwo,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import DetailsRow from './DetailsRow';
import ServiceRow from './ServiceRow';
import './styles.scss';

const computeServicePrice = (services, exchangeRates) => {
  return services.map(service => {
    const serviceExchange = exchangeRates.find(
      rate => rate.currency === service.currency,
    ) || { value: 1 };
    const servicePrice = service.amount * serviceExchange.value * service.count;
    return {
      ...service,
      created: moment(service.created).toDate(),
      totalPrice: roundToTwo(servicePrice),
    };
  });
};

const getDiscount = (total, discount) => {
  const discountAmount = total * (discount / 100);
  let discountedTotal = total - discountAmount;
  // check if discounted total is not less than 0 or not greater then total amount
  if (discountedTotal > total) discountedTotal = total;
  if (discountedTotal < 0) discountedTotal = 0;
  return roundToTwo(discountedTotal);
};

const initialState = {
  isLoading: false,
  isFetching: false,
  isDebt: false,
  payAmount: '0',
  discount: '0',
  services: [],
  showConfirmationMenu: false,
  isSearchingPatient: false,
  invoiceStatus: 'PendingPayment',
  searchResults: [],
  invoiceDetails: {
    status: 'PendingPayment',
    services: [],
    totalAmount: 0,
    discount: 0,
    paidAmount: 0,
    schedule: null,
    doctor: {
      id: -1,
      name: '',
    },
    patient: {
      id: -1,
      name: '',
    },
  },
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
  setDoctor: 'setDoctor',
  setPatient: 'setPatient',
  setIsSearchingPatient: 'setIsSearchingPatient',
  setSearchResults: 'setSearchResults',
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
      const servicesTotal = sumBy(state.services, item => item.totalPrice);
      let discountedTotal = getDiscount(servicesTotal, newDiscount);
      // check if current entered pay amount is not greater than discounted total
      let currentPayAmount = state.payAmount;
      if (currentPayAmount > discountedTotal) {
        currentPayAmount = discountedTotal;
      }
      return {
        ...state,
        discount: newDiscount,
        totalAmount: roundToTwo(discountedTotal),
        payAmount: roundToTwo(currentPayAmount),
      };
    }
    case reducerTypes.setServices: {
      // get data from state and payload
      const { services, exchangeRates } = action.payload;
      const { invoiceDetails, payAmount, discount } = state;
      // get invoice status
      const isDebt = invoiceDetails.status === 'PartialPaid';
      // compute services total price
      const updatedServices = computeServicePrice(services, exchangeRates);
      const servicesPrice = parseFloat(
        sumBy(updatedServices, item => item.totalPrice),
      ).toFixed(2);
      // compute new total amount
      const newTotalAmount = isDebt
        ? invoiceDetails.totalAmount - invoiceDetails.paidAmount
        : roundToTwo(servicesPrice);
      // apply the discount to new total amount
      const discountedTotal = getDiscount(newTotalAmount, discount);
      return {
        ...state,
        services: updatedServices,
        payAmount: payAmount < discountedTotal ? payAmount : discountedTotal,
        totalAmount: discountedTotal,
      };
    }
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
        invoiceDetails.services,
        exchangeRates,
      );
      const servicesPrice = parseFloat(
        sumBy(updatedServices, item => item.totalPrice),
      ).toFixed(2);

      const invoiceTotal = isDebt
        ? invoiceDetails.totalAmount
        : roundToTwo(servicesPrice);
      const invoiceDiscount = isDebt
        ? invoiceDetails.discount
        : invoiceDetails.patient.discount;
      const discountedAmount = getDiscount(invoiceTotal, invoiceDiscount);
      return {
        ...state,
        invoiceDetails: {
          ...invoiceDetails,
          services: updatedServices,
        },
        payAmount: discountedAmount - invoiceDetails.paidAmount,
        totalAmount: discountedAmount,
        discount: invoiceDiscount,
        services: updatedServices,
        invoiceStatus: invoiceDetails.status,
        isDebt,
      };
    }
    case reducerTypes.resetState:
      return initialState;
    case reducerTypes.setDoctor:
      return {
        ...state,
        invoiceDetails: { ...state.invoiceDetails, doctor: action.payload },
      };
    case reducerTypes.setPatient: {
      const patient = action.payload;
      return {
        ...state,
        invoiceDetails: {
          ...state.invoiceDetails,
          patient,
          discount: patient.discount || 0,
        },
      };
    }
    case reducerTypes.setIsSearchingPatient:
      return { ...state, isSearchingPatient: action.payload };
    case reducerTypes.setSearchResults:
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
};

const CheckoutModal = ({ open, invoice, isNew, onClose }) => {
  const dispatch = useDispatch();
  const exchangeRates = useSelector(clinicExchangeRatesSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const updateInvoices = useSelector(updateInvoicesSelector);
  const [
    {
      isLoading,
      payAmount,
      discount,
      services,
      invoiceDetails,
      isFetching,
      totalAmount,
      isDebt,
      isSearchingPatient,
      searchResults,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  useEffect(() => {
    if (invoice != null) {
      fetchInvoiceDetails();
    }
  }, [isNew, invoice, exchangeRates, updateInvoices]);

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

  const handleSearchPatients = async (event, newValue) => {
    if (newValue.length < 3) {
      localDispatch(actions.setSearchResults([]));
      localDispatch(actions.setIsSearchingPatient(false));
      return;
    }
    const updatedQuery = newValue.replace('+', '');
    localDispatch(actions.setIsSearchingPatient(true));
    const response = await dataAPI.searchPatients(updatedQuery);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { data } = response;
      localDispatch(
        actions.setSearchResults(
          data.map(item => ({ ...item, name: item.fullName })),
        ),
      );
    }
    localDispatch(actions.setIsSearchingPatient(false));
  };

  const handlePatientFieldChange = useCallback(
    debounce(handleSearchPatients, 500),
    [],
  );

  const handleDoctorSelected = (event, doctor) => {
    localDispatch(actions.setDoctor(doctor));
  };

  const handlePatientSelected = (event, patient) => {
    localDispatch(actions.setPatient(patient));
  };

  const handleDiscountChanged = ({ value }) => {
    const newDiscount = adjustValueToNumber(value, 100);
    localDispatch(actions.setDiscount(newDiscount));
  };

  const handlePayAmountChange = ({ value }) => {
    const newAmount = adjustValueToNumber(value, totalAmount);
    localDispatch(actions.setPayAmount(newAmount));
  };

  const handleServiceChanged = newService => {
    const newServices = services.map(service => {
      if (
        service.id !== newService.id ||
        service.toothId !== newService.toothId ||
        service.destination !== newService.destination
      ) {
        return service;
      }
      return newService;
    });
    localDispatch(
      actions.setServices({ services: newServices, exchangeRates }),
    );
  };

  const handleSubmit = async () => {
    if (invoiceDetails == null) {
      return;
    }
    const servicesPrice = parseFloat(
      sumBy(services, item => item.totalPrice),
    ).toFixed(2);
    const requestBody = {
      paidAmount: payAmount,
      discount: discount,
      totalAmount: servicesPrice,
      services: services.map(item => ({
        id: item.id,
        serviceId: item.serviceId,
        price: item.amount,
        count: item.count,
        currency: item.currency,
      })),
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

  const handlePatientClick = () => {
    if (invoiceDetails.patient.id === -1) {
      return;
    }
    onClose();
    dispatch(
      setPatientDetails({
        show: true,
        patientId: invoiceDetails.patient.id,
        onDelete: null,
      }),
    );
  };

  const getDateHour = date => {
    if (date == null) return '';
    return moment(date).format('HH:mm');
  };

  const startDate =
    invoiceDetails?.schedule != null
      ? moment(invoiceDetails?.schedule.startTime).format('DD MMM YYYY')
      : '';
  const startHour = getDateHour(invoiceDetails?.schedule?.startTime);
  const endHour = getDateHour(invoiceDetails?.schedule?.endTime);
  const scheduleTime = `${startDate} ${startHour} - ${endHour}`;

  return (
    <Modal
      open={open}
      onBackdropClick={onClose}
      className='checkout-modal-root'
    >
      <Paper classes={{ root: clsx('checkout-modal-root__paper', 'lg') }}>
        <Box className='services-container'>
          <Typography classes={{ root: 'services-container__title' }}>
            {textForKey('Services')}
          </Typography>
          <TableContainer classes={{ root: 'services-table-container' }}>
            <Table classes={{ root: 'services-table' }}>
              <TableBody classes={{ root: 'services-table__body' }}>
                {services.map((service, index) => (
                  <ServiceRow
                    key={`${service.id}-${index}`}
                    canEdit={!isDebt}
                    service={service}
                    onChange={handleServiceChanged}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className='data-container'>
          <IconButton classes={{ root: 'close-button' }} onClick={onClose}>
            <IconClose />
          </IconButton>
          {isFetching && (
            <div className='loading-wrapper'>
              <CircularProgress classes={{ root: 'loading-progress' }} />
            </div>
          )}
          <Typography classes={{ root: 'data-container__title' }}>
            {textForKey('Details')}
          </Typography>
          {!isFetching && (
            <TableContainer classes={{ root: 'details-table-container' }}>
              <Table classes={{ root: 'details-table' }}>
                <TableBody>
                  <DetailsRow
                    isValueInput={isNew}
                    onValueSelected={handleDoctorSelected}
                    valuePlaceholder={`${textForKey(
                      'Select doctor',
                    )} (${textForKey('Optional')})`}
                    options={doctors.map(it => ({
                      ...it,
                      name: `${it.firstName} ${it.lastName}`,
                    }))}
                    title={textForKey('Doctor')}
                    value={invoiceDetails.doctor}
                  />
                  <DetailsRow
                    searchable
                    isLoading={isSearchingPatient}
                    onSearch={handlePatientFieldChange}
                    onValueSelected={handlePatientSelected}
                    clickableValue={!isNew}
                    isValueInput={isNew}
                    options={searchResults}
                    valuePlaceholder={textForKey('Select patient')}
                    title={textForKey('Patient')}
                    value={invoiceDetails.patient}
                    onValueClick={handlePatientClick}
                  />
                  {!isNew && (
                    <DetailsRow
                      title={textForKey('Date')}
                      value={scheduleTime}
                    />
                  )}
                  <TableRow>
                    <TableCell
                      align='center'
                      colSpan={2}
                      classes={{
                        root: clsx(
                          'details-table__row__cell',
                          'for-payment-title-cell',
                        ),
                      }}
                    >
                      <Typography classes={{ root: 'label' }}>
                        {textForKey('For payment')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align='center'
                      colSpan={2}
                      classes={{
                        root: clsx(
                          'details-table__row__cell',
                          'for-payment-field-cell',
                        ),
                      }}
                    >
                      <NumberFormat
                        autoFocus
                        value={payAmount === 0 ? '' : String(payAmount)}
                        thousandSeparator
                        onValueChange={handlePayAmountChange}
                        suffix={clinicCurrency}
                        placeholder={`0${clinicCurrency}`}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align='center'
                      classes={{
                        root: clsx(
                          'details-table__row__cell',
                          'total-amount-cell',
                        ),
                      }}
                    >
                      <Typography classes={{ root: 'label' }}>
                        {textForKey('from')}{' '}
                        {formattedAmount(totalAmount, clinicCurrency)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align='center'
                      classes={{
                        root: clsx(
                          'details-table__row__cell',
                          'total-discount-cell',
                        ),
                      }}
                    >
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        width='100%'
                      >
                        <Typography classes={{ root: 'label' }}>
                          {textForKey('Discount')}
                        </Typography>
                        <NumberFormat
                          disabled={isDebt}
                          value={discount === 0 ? '' : String(discount)}
                          onValueChange={handleDiscountChanged}
                          suffix='%'
                          placeholder='0%'
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {!isFetching && invoiceDetails != null && (
            <Box
              display='flex'
              width='100%'
              alignItems='center'
              justifyContent='center'
            >
              {!isLoading ? (
                <Button
                  onClick={handleSubmit}
                  classes={{ root: 'data-container__pay-btn' }}
                  variant='contained'
                >
                  {textForKey('Pay')}{' '}
                  {formattedAmount(payAmount, clinicCurrency)}
                </Button>
              ) : (
                <CircularProgress
                  classes={{ root: 'data-container__paying' }}
                />
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default CheckoutModal;

CheckoutModal.propTypes = {
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
  isNew: PropTypes.bool,
  onClose: PropTypes.func,
};
