import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import EASTextarea from 'app/components/common/EASTextarea';
import IconClose from 'app/components/icons/iconClose';
import NotificationsContext from 'app/context/notificationsContext';
import adjustValueToNumber from 'app/utils/adjustValueToNumber';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import {
  createNewInvoice,
  fetchDetailsForInvoice,
  registerInvoicePayment,
} from 'middleware/api/invoices';
import { searchPatients } from 'middleware/api/patients';
import {
  activeClinicDoctorsSelector,
  clinicExchangeRatesSelector,
  currentClinicSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import { updateInvoiceSelector } from 'redux/selectors/invoicesSelector';
import { updateInvoicesSelector } from 'redux/selectors/rootSelector';
import { setPatientDetails } from 'redux/slices/mainReduxSlice';
import TeethModal from '../TeethModal';
import styles from './CheckoutModal.module.scss';
import {
  actions,
  getServicesTotalPrice,
  initialState,
  reducer,
} from './CheckoutModal.reducer';
import DetailsRow from './DetailsRow';
import ServicesList from './ServicesList';

const getDateHour = (date) => {
  if (date == null) return '';
  return moment(date).format('HH:mm');
};

const CheckoutModal = ({
  open,
  invoice,
  schedule,
  isNew,
  openPatientDetailsOnClose,
  onClose,
}) => {
  const toast = useContext(NotificationsContext);
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
  const exchangeRates = useSelector(clinicExchangeRatesSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const clinicDoctors = useSelector(activeClinicDoctorsSelector);
  const [commentValue, setCommentValue] = useState('');
  const userClinic = useSelector(userClinicSelector);
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
  }, [invoiceDetails]);

  const canPay = useMemo(() => {
    return (
      (!isNew || (invoiceDetails.patient.id !== -1 && services.length > 0)) &&
      canRegisterPayments
    );
  }, [isNew, invoiceDetails, services, canRegisterPayments]);

  const clinicServices = useMemo(() => {
    return (
      currentClinic.services?.filter(
        (service) =>
          service.serviceType !== 'System' &&
          (invoiceDetails.doctor?.id === -1 ||
            invoiceDetails.doctor?.services?.some(
              (item) => item.serviceId === service?.id,
            )),
      ) || []
    );
  }, [currentClinic.services, invoiceDetails]);

  const doctors = useMemo(() => {
    return clinicDoctors.map((item) => {
      const fullName = `${item.firstName} ${item.lastName}`;
      return {
        ...item,
        name: fullName,
        label: fullName,
        fullName,
      };
    });
  }, [clinicDoctors]);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    } else {
      dispatch(
        setPatientDetails({
          show: false,
          patientId: null,
          canDelete: false,
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
    const scheduleClone = cloneDeep(schedule);
    scheduleClone.doctor = doctors.find(
      (item) => item.id === schedule.doctorId,
    );
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
      const response = await searchPatients(newValue);
      const { data: patients } = response.data;
      localDispatch(
        actions.setSearchResults(
          patients.map((item) => {
            const phoneNumber = `(+${item.countryCode}${item.phoneNumber})`;
            return {
              ...item,
              name: `${item.fullName} ${phoneNumber}`,
              label: item.fullName,
            };
          }),
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
      if (newService.isChild) {
        return {
          ...service,
          childServices: service.childServices.map((child) => {
            if (child.id !== newService.id) return child;
            return { ...child, ...newService };
          }),
        };
      } else if (
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
  };

  const handleTeethSelected = (service, teeth) => {
    const serviceExists = services.some((item) => item.id === service.id);
    if (serviceExists) {
      const newServices = services.map((item) => {
        if (item.id !== service.id) {
          return item;
        }
        return {
          ...item,
          teeth: uniq([...item.teeth, ...teeth]),
        };
      });
      localDispatch(
        actions.setServices({ services: newServices, exchangeRates }),
      );
    } else {
      const newServices = [
        {
          ...service,
          teeth,
          amount: service.price,
          count: 1,
          totalPrice: service.price,
          childServices: service.childServices.map((child) => ({
            ...child,
            amount: child.price,
            count: 1,
            totalPrice: child.price,
          })),
        },
        ...services,
      ];

      localDispatch(
        actions.setServices({ services: newServices, exchangeRates }),
      );
    }
  };

  const handleNewServiceSelected = (service) => {
    if (service.serviceType === 'Single') {
      localDispatch(actions.setTeethModal({ open: true, service }));
      return;
    }
    const serviceExists = services.some(
      (item) =>
        item.serviceId === service.id &&
        item.destination === service.destination,
    );
    if (serviceExists) {
      return;
    }
    const newServices = cloneDeep(services);
    newServices.unshift({
      ...service,
      serviceId: service.id,
      amount: service.price,
      count: 1,
      totalPrice: service.price,
      destination: service.destination,
      childServices: service.childServices.map((child) => ({
        ...child,
        amount: child.price,
        count: 1,
        totalPrice: child.price,
      })),
    });
    localDispatch(
      actions.setServices({ services: newServices, exchangeRates }),
    );
  };

  const handleServiceRemoved = (service, isChild) => {
    if (isChild) {
      const newServices = services.map((item) => ({
        ...item,
        childServices: item.childServices.filter(
          (child) => child.id !== service.id,
        ),
      }));
      localDispatch(
        actions.setServices({ services: newServices, exchangeRates }),
      );
    } else {
      const newServices = services.filter((item) => item.id !== service.id);
      localDispatch(
        actions.setServices({ services: newServices, exchangeRates }),
      );
    }
  };

  const getRequestBody = () => {
    const servicesPrice = getServicesTotalPrice(services, exchangeRates);
    const requestBody = {
      paidAmount: payAmount,
      discount: discount,
      comment: commentValue || null,
      totalAmount: servicesPrice,
      services: services.map((item) => ({
        id: item.id,
        price: item.amount,
        count: item.count,
        currency: item.currency,
        teeth: item.teeth ?? [],
        bracesPlanType: item.destination,
        childServices: item.childServices.map((child) => ({
          id: child.id,
          price: child.amount,
          count: child.count,
          currency: child.currency,
        })),
      })),
    };

    if (isNew) {
      requestBody.patientId = invoiceDetails.patient.id;
      requestBody.doctorId = invoiceDetails.doctor.id;
    }

    if (schedule != null) {
      requestBody.scheduleId = schedule.id;
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

  const handleCommentInsertion = (value) => {
    setCommentValue(value);
  };

  const handleSubmit = async () => {
    if (invoiceDetails == null) {
      return;
    }
    try {
      const requestBody = getRequestBody();
      localDispatch(actions.setIsLoading(true));
      isNew
        ? await createNewInvoice(requestBody)
        : await registerInvoicePayment(invoiceDetails.id, requestBody);
      if (openPatientDetailsOnClose) {
        handlePatientClick();
      } else {
        onClose();
      }
    } catch (error) {
      onRequestError(error);
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
        canDelete: false,
        menuItem: 'debts',
      }),
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      className={styles.checkoutModalRoot}
    >
      <Paper classes={{ root: styles.paper }}>
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
        <div className={styles.dataContainer}>
          <IconButton
            classes={{ root: styles.closeButton }}
            onClick={handleCloseModal}
          >
            <IconClose />
          </IconButton>
          {isFetching && (
            <div className='progress-bar-wrapper'>
              <CircularProgress className='circular-progress-bar' />
            </div>
          )}
          <Typography classes={{ root: styles.title }}>
            {textForKey('Details')}
          </Typography>
          {!isFetching && (
            <TableContainer classes={{ root: styles.detailsTableContainer }}>
              <Table classes={{ root: styles.detailsTable }}>
                <TableHead classes={{ root: styles.detailsTableHead }}>
                  {invoiceDetails.doctor != null && (
                    <DetailsRow
                      filterLocally
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
                  {(!isNew || schedule != null) &&
                    invoiceDetails.schedule != null && (
                      <DetailsRow
                        title={textForKey('Date')}
                        value={{ name: scheduleTime }}
                      />
                    )}
                </TableHead>
                <TableBody
                  classes={{
                    root:
                      window.innerHeight > 720 ? styles.detailsTableBody : '',
                  }}
                >
                  <TableRow className={styles.row}>
                    <TableCell
                      align='center'
                      colSpan={2}
                      classes={{
                        root: clsx(styles.cell, styles.forPaymentTitleCell),
                      }}
                    >
                      <Typography classes={{ root: styles.label }}>
                        {textForKey('For payment')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow className={styles.row}>
                    <TableCell
                      align='center'
                      colSpan={2}
                      classes={{
                        root: clsx(styles.cell, styles.forPaymentFieldCell),
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
                  <TableRow className={styles.row}>
                    <TableCell
                      colSpan={2}
                      align='center'
                      classes={{
                        root: clsx(styles.cell, styles.totalAmountCell),
                      }}
                    >
                      <Typography classes={{ root: styles.label }}>
                        {textForKey('from')}{' '}
                        {formattedAmount(totalAmount, clinicCurrency)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow className={styles.row}>
                    <TableCell
                      colSpan={2}
                      align='center'
                      classes={{
                        root: clsx(styles.cell, styles.totalDiscountCell),
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
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <EASTextarea
                containerClass={styles.textArea}
                placeholder={textForKey('add a comment')}
                value={commentValue}
                rows={2}
                maxRows={2}
                onChange={handleCommentInsertion}
              />
              {!isLoading ? (
                <Button
                  disabled={!canPay}
                  onClick={handleSubmit}
                  classes={{ root: styles.payBtn }}
                  variant='contained'
                >
                  {textForKey('Pay')}{' '}
                  {formattedAmount(payAmount, clinicCurrency)}
                </Button>
              ) : (
                <CircularProgress classes={{ root: styles.paying }} />
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
    services: PropTypes.arrayOf(PropTypes.any),
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
