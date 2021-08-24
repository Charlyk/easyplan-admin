import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

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

import {
  createNewInvoice,
  fetchDetailsForInvoice,
  registerInvoicePayment
} from "../../../../../middleware/api/invoices";
import { savePatientGeneralTreatmentPlan } from "../../../../../middleware/api/patients";
import IconClose from '../../../../../components/icons/iconClose';
import { setPatientDetails } from '../../../../../redux/actions/actions';
import { updateInvoiceSelector } from '../../../../../redux/selectors/invoicesSelector';
import { updateInvoicesSelector } from '../../../../../redux/selectors/rootSelector';
import {
  adjustValueToNumber,
  formattedAmount,
  getClinicExchangeRates
} from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import { Role } from "../../../../utils/constants";
import TeethModal from "../TeethModal";
import DetailsRow from './DetailsRow';
import ServicesList from './ServicesList';
import {
  actions,
  initialState,
  reducer
} from './CheckoutModal.reducer';
import styles from './CheckoutModal.module.scss';

const getDateHour = (date) => {
  if (date == null) return '';
  return moment(date).format('HH:mm');
};

const CheckoutModal = (
  {
    open,
    invoice,
    schedule,
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
      teethModal,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const updateInvoice = useSelector(updateInvoiceSelector);
  const updateInvoices = useSelector(updateInvoicesSelector);
  const exchangeRates = getClinicExchangeRates(currentClinic);
  const userClinic = useMemo(() => {
    return currentUser.clinics.find(clinic => clinic.clinicId === currentClinic.id);
  }, [currentClinic]);
  const { canRegisterPayments } = userClinic;
  const clinicCurrency = currentClinic.currency;
  const clinicBraces = currentClinic.braces ?? [];

  const scheduleTime = useMemo(() => {
    const startDate = moment(invoiceDetails?.schedule?.startTime).format(
      'DD MMM YYYY',
    );
    const startHour = getDateHour(invoiceDetails?.schedule?.startTime);
    const endHour = getDateHour(invoiceDetails?.schedule?.endTime);
    return `${startDate} ${startHour} - ${endHour}`;
  }, [invoiceDetails])

  const canPay = useMemo(() => {
    return (!isNew || (invoiceDetails.patient.id !== -1 && services.length > 0)) && canRegisterPayments;
  }, [isNew, invoiceDetails, services, canRegisterPayments]);

  const clinicServices = useMemo(() => {
    return currentClinic.services?.filter((service) =>
      service.serviceType !== 'System' &&
      (invoiceDetails.doctor?.id === -1 ||
        invoiceDetails.doctor?.services?.some(
          (item) => item.serviceId === service?.id,
        )
      )
    ) || [];
  }, [currentClinic.services, invoiceDetails]);

  const doctors = useMemo(() => {
    return currentClinic.users.filter((item) =>
      item.roleInClinic === Role.doctor && !item.isHidden
    ).map((item) => ({
      ...item,
      name: `${item.firstName} ${item.lastName}`,
      fullName: `${item.firstName} ${item.lastName}`,
    }));
  }, [currentClinic.users]);

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

  useEffect(() => {
    if (schedule == null || !isNew) {
      return;
    }
    const scheduleClone = cloneDeep(schedule)
    scheduleClone.doctor = doctors.find(item => item.id === schedule.doctorId)
    localDispatch(actions.setScheduleDetails(scheduleClone));
  }, [schedule, isNew]);

  const fetchInvoiceDetails = async () => {
    if (invoice == null || exchangeRates.length === 0) {
      return;
    }
    localDispatch(actions.setIsFetching(true));
    try {
      const response = await fetchDetailsForInvoice(invoice.id);
      const { data: invoiceDetails } = response;
      localDispatch(
        actions.setupInvoiceData({ invoiceDetails, exchangeRates }),
      );
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.message || error.message);
      } else {
        toast.error(error.message);
      }
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

  const handleCloseTeethModal = () => {
    localDispatch(actions.setTeethModal({ open: false, service: null }));
  }

  const handleTeethSelected = (service, teeth) => {
    const newServices = cloneDeep(services);
    for (const tooth of teeth) {
      service.toothId = tooth;
      const serviceExists = newServices.some(
        (item) => item.serviceId === service.id && item.toothId === service.toothId,
      );
      if (serviceExists) {
        continue;
      }
      newServices.unshift({
        ...service,
        serviceId: service.id,
        currency: clinicCurrency,
        amount: service.price,
        count: 1,
        totalPrice: service.price,
      });
    }
    localDispatch(
      actions.setServices({ services: newServices, exchangeRates }),
    );
  }

  const handleNewServiceSelected = (service) => {
    if (service.serviceType === 'Single') {
      localDispatch(actions.setTeethModal({ open: true, service }));
      return;
    }
    const serviceExists = services.some(
      (item) => item.serviceId === service.id && item.destination === service.destination,
    );
    if (serviceExists) {
      return;
    }
    const newServices = cloneDeep(services);
    newServices.unshift({
      ...service,
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
    remove(newServices, (item) =>
      item.serviceId === service.serviceId &&
      item.toothId === service.toothId &&
      item.destination === service.destination
    );
    localDispatch(
      actions.setServices({ services: newServices, exchangeRates }),
    );
  };

  const getPlanRequestBody = () => {
    return {
      patientId: invoiceDetails.patient.id,
      scheduleId: schedule.id,
      services: services.map(service => ({
        serviceId: service.id,
        toothId: service.toothId ?? null,
        destination: service.destination ?? null,
        completed: true,
        price: service.amount,
        currency: service.currency,
        count: service.count,
        isBraces: service.serviceType == null,
      })),
    };
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
        toothId: item.toothId ?? null,
        destination: item.destination ?? null,
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
      schedule != null
        ? await savePatientGeneralTreatmentPlan({
          ...getPlanRequestBody(),
          paymentRequest: requestBody
        })
        : isNew
        ? await createNewInvoice(requestBody)
        : await registerInvoicePayment(invoiceDetails.id, requestBody);
      // await router.replace(router.asPath);
      if (openPatientDetailsOnClose) {
        handlePatientClick();
      } else {
        onClose();
      }
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        toast.error(data.message || error.message);
      } else {
        toast.error(error.message);
      }
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

  return (
    <Modal
      open={open}
      onBackdropClick={handleCloseModal}
      className={styles['checkout-modal-root']}
    >
      <Paper classes={{ root: styles['checkout-modal-root__paper'] }}>
        <TeethModal
          open={teethModal.open}
          service={teethModal.service}
          onClose={handleCloseTeethModal}
          onSave={handleTeethSelected}
        />
        <ServicesList
          currencies={exchangeRates}
          canAddService={isNew}
          isDebt={isDebt}
          services={services}
          availableBraces={clinicBraces}
          availableServices={clinicServices}
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
                      isValueInput={isNew && schedule == null}
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
                    clickableValue={!isNew || schedule != null}
                    isValueInput={isNew && schedule == null}
                    options={searchResults}
                    valuePlaceholder={textForKey('Select patient')}
                    title={textForKey('Patient')}
                    value={invoiceDetails.patient}
                    onValueClick={handlePatientClick}
                  />
                  {(!isNew || schedule != null) && invoiceDetails.schedule != null && (
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
  schedule: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
    scheduleStatus: PropTypes.string,
    canceledReason: PropTypes.string,
    isUrgent: PropTypes.bool,
    urgent: PropTypes.bool,
    delayTime: PropTypes.number,
  }),
  isNew: PropTypes.bool,
  onClose: PropTypes.func,
  openPatientDetailsOnClose: PropTypes.bool,
};
