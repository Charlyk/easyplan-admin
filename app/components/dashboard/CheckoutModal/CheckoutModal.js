import React, { useCallback, useEffect, useReducer } from 'react';

import {
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
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import remove from 'lodash/remove';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { toast } from 'react-toastify';

import IconClose from '../../../../components/icons/iconClose';
import { setPatientDetails } from '../../../../redux/actions/actions';
import { updateInvoiceSelector } from '../../../../redux/selectors/invoicesSelector';
import { updateInvoicesSelector } from '../../../../redux/selectors/rootSelector';
import {
  adjustValueToNumber,
  formattedAmount,
  getClinicExchangeRates,
} from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import { Role } from "../../../utils/constants";
import DetailsRow from './DetailsRow';
import ServicesList from './ServicesList';
import { reducer, initialState, actions } from './CheckoutModal.reducer';
import styles from './CheckoutModal.module.scss';


const CheckoutModal = (
  {
    open,
    invoice,
    isNew,
    openPatientDetailsOnClose,
    onClose,
    currentUser,
    currentClinic,
  }
) => {
  const dispatch = useDispatch();
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
  const updateInvoice = useSelector(updateInvoiceSelector);
  const exchangeRates = getClinicExchangeRates(currentClinic);
  const userClinic = currentUser.clinics.find(clinic => clinic.clinicId === currentClinic.id);
  const { canRegisterPayments } = userClinic;
  const clinicCurrency = currentClinic.currency;
  const clinicServices = currentClinic.services?.filter((item) =>
    item.serviceType !== 'System'
  ) || [];
  const doctors = currentClinic.users.filter((item) =>
    item.roleInClinic === Role.doctor && !item.isHidden
  ).map((item) => ({
    ...item,
    fullName: `${item.firstName} ${item.lastName}`,
  }));
  const updateInvoices = useSelector(updateInvoicesSelector);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    } else {
      dispatch(
        setPatientDetails({
          show: false,
          patientId: null,
          onDelete: null,
        }),
      );
    }
  }, [open]);

  useEffect(() => {
    if (invoice != null) {
      fetchInvoiceDetails();
    }
  }, [isNew, invoice, exchangeRates, updateInvoices]);

  useEffect(() => {
    if (
      invoice == null ||
      updateInvoice == null ||
      updateInvoice.id !== invoice.id
    ) {
      return;
    }
    fetchInvoiceDetails();
  }, [updateInvoice]);

  const fetchInvoiceDetails = async () => {
    if (invoice == null || exchangeRates.length === 0) {
      return;
    }
    localDispatch(actions.setIsFetching(true));
    try {
      const response = await axios.get(`/api/invoices/${invoice.id}`);
      const { data: invoiceDetails } = response;
      localDispatch(
        actions.setupInvoiceData({ invoiceDetails, exchangeRates }),
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsFetching(false));
    }
  };

  const handleSearchPatients = async (event, newValue) => {
    if (newValue.length < 3) {
      localDispatch(actions.setSearchResults([]));
      localDispatch(actions.setIsSearchingPatient(false));
      return;
    }
    localDispatch(actions.setIsSearchingPatient(true));
    try {
      const updatedQuery = newValue.replace('+', '');
      const queryParams = {
        query: updatedQuery,
      };
      const queryString = new URLSearchParams(queryParams).toString()
      const response = await axios.get(`/api/patients/search?${queryString}`);
      const { data } = response;
      localDispatch(
        actions.setSearchResults(
          data.map((item) => ({
            ...item,
            name: `${item.fullName} (${item.phoneNumber})`,
          })),
        ),
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsSearchingPatient(false));
    }
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

  const handlePayAmountChange = ({ floatValue }) => {
    const newAmount = adjustValueToNumber(floatValue, totalAmount);
    localDispatch(actions.setPayAmount(newAmount));
  };

  const handleServiceChanged = (newService) => {
    const newServices = services.map((service) => {
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

  const handleNewServiceSelected = (service) => {
    const serviceExists = services.some(
      (item) => item.serviceId === service.id,
    );
    if (serviceExists) {
      return;
    }
    const newServices = cloneDeep(services);
    newServices.unshift({
      id: service.id,
      name: service.name,
      serviceId: service.id,
      currency: clinicCurrency,
      amount: service.price,
      count: 1,
      totalPrice: service.price,
    });
    localDispatch(
      actions.setServices({ services: newServices, exchangeRates }),
    );
  };

  const handleServiceRemoved = (service) => {
    const newServices = cloneDeep(services);
    remove(newServices, (item) => item.serviceId === service.serviceId);
    localDispatch(
      actions.setServices({ services: newServices, exchangeRates }),
    );
  };

  const getRequestBody = () => {
    const servicesPrice = parseFloat(
      sumBy(services, (item) => item.totalPrice),
    ).toFixed(2);
    const requestBody = {
      paidAmount: payAmount,
      discount: discount,
      totalAmount: servicesPrice,
      services: services.map((item) => ({
        id: item.id,
        serviceId: item.serviceId,
        price: item.amount,
        count: item.count,
        currency: item.currency,
      })),
    };

    if (isNew) {
      requestBody.patientId = invoiceDetails.patient.id;
      requestBody.doctorId = invoiceDetails.doctor.id;
    }

    return requestBody;
  };

  const handleCloseModal = () => {
    if (openPatientDetailsOnClose) {
      handlePatientClick();
    } else {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (invoiceDetails == null) {
      return;
    }
    try {
      const requestBody = getRequestBody();
      localDispatch(actions.setIsLoading(true));
      isNew
        ? await axios.post(`/api/invoices`, requestBody)
        : await axios.put(`/api/invoices/${invoiceDetails.id}`, requestBody);
      // await router.replace(router.asPath);
      if (openPatientDetailsOnClose) {
        handlePatientClick();
      } else {
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
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
        menuItem: 'debts',
      }),
    );
  };

  const getDateHour = (date) => {
    if (date == null) return '';
    return moment(date).format('HH:mm');
  };

  const startDate = moment(invoiceDetails?.schedule?.startTime).format(
    'DD MMM YYYY',
  );
  const startHour = getDateHour(invoiceDetails?.schedule?.startTime);
  const endHour = getDateHour(invoiceDetails?.schedule?.endTime);
  const scheduleTime = `${startDate} ${startHour} - ${endHour}`;

  const filteredServices = isNew
    ? clinicServices.filter((clinicService) => {
      return (
        invoiceDetails.doctor.id === -1 ||
        invoiceDetails.doctor.services.some(
          (item) => item.serviceId === clinicService.id,
        )
      );
    })
    : [];

  const canPay =
    (!isNew || (invoiceDetails.patient.id !== -1 && services.length > 0)) && canRegisterPayments;

  return (
    <Modal
      open={open}
      onBackdropClick={handleCloseModal}
      className={styles['checkout-modal-root']}
    >
      <Paper classes={{ root: styles['checkout-modal-root__paper'] }}>
        <ServicesList
          currencies={exchangeRates}
          canAddService={isNew}
          isDebt={isDebt}
          services={services}
          availableServices={filteredServices}
          onServiceChanged={handleServiceChanged}
          onServiceSelected={handleNewServiceSelected}
          onServiceDeleted={handleServiceRemoved}
        />
        <div className={styles['data-container']}>
          <IconButton
            classes={{ root: styles['close-button'] }}
            onClick={handleCloseModal}
          >
            <IconClose/>
          </IconButton>
          {isFetching && (
            <div className='progress-bar-wrapper'>
              <CircularProgress className='circular-progress-bar'/>
            </div>
          )}
          <Typography classes={{ root: styles.title }}>
            {textForKey('Details')}
          </Typography>
          {!isFetching && (
            <TableContainer classes={{ root: styles['details-table-container'] }}>
              <Table classes={{ root: styles['details-table'] }}>
                <TableBody>
                  {invoiceDetails.doctor != null && (
                    <DetailsRow
                      isValueInput={isNew}
                      onValueSelected={handleDoctorSelected}
                      valuePlaceholder={`${textForKey(
                        'Select doctor',
                      )} (${textForKey('Optional')})`}
                      options={doctors.map((it) => ({
                        ...it,
                        name: `${it.firstName} ${it.lastName}`,
                      }))}
                      title={textForKey('Doctor')}
                      value={invoiceDetails.doctor}
                    />
                  )}
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
                  {!isNew && invoiceDetails.schedule != null && (
                    <DetailsRow
                      title={textForKey('Date')}
                      value={{ name: scheduleTime }}
                    />
                  )}
                  <TableRow>
                    <TableCell
                      align='center'
                      colSpan={2}
                      classes={{
                        root: clsx(
                          styles['details-table__row__cell'],
                          styles['for-payment-title-cell'],
                        ),
                      }}
                    >
                      <Typography classes={{ root: styles.label }}>
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
                          styles['details-table__row__cell'],
                          styles['for-payment-field-cell'],
                        ),
                      }}
                    >
                      <NumberFormat
                        autoFocus
                        value={payAmount || ''}
                        thousandSeparator='.'
                        decimalSeparator=','
                        allowNegative={false}
                        decimalScale={2}
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
                          styles['details-table__row__cell'],
                          styles['total-amount-cell'],
                        ),
                      }}
                    >
                      <Typography classes={{ root: styles.label }}>
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
                          styles['details-table__row__cell'],
                          styles['total-discount-cell'],
                        ),
                      }}
                    >
                      <div
                        className='flexContainer'
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Typography classes={{ root: styles.label }}>
                          {textForKey('Discount')}
                        </Typography>
                        <NumberFormat
                          disabled={isDebt}
                          value={discount === 0 ? '' : String(discount)}
                          onValueChange={handleDiscountChanged}
                          suffix='%'
                          placeholder='0%'
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {!isFetching && invoiceDetails != null && (
            <div
              className='flexContainer'
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {!isLoading ? (
                <Button
                  disabled={!canPay}
                  onClick={handleSubmit}
                  classes={{ root: styles['pay-btn'] }}
                  variant='contained'
                >
                  {textForKey('Pay')}{' '}
                  {formattedAmount(payAmount, clinicCurrency)}
                </Button>
              ) : (
                <CircularProgress
                  classes={{ root: styles.paying }}
                />
              )}
            </div>
          )}
        </div>
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
  openPatientDetailsOnClose: PropTypes.bool,
};
