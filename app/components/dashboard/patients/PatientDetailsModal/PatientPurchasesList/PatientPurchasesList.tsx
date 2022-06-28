import React, { useEffect, useState, useMemo, useRef } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import StatisticFilter from 'app/components/dashboard/analytics/StatisticFilter';
import { HeaderKeys } from 'app/utils/constants';
import formattedAmount from 'app/utils/formattedAmount';
import getCurrentWeek from 'app/utils/getCurrentWeek';
import updatedServerUrl from 'app/utils/updateServerUrl';
import {
  authTokenSelector,
  clinicCurrencySelector,
  clinicTimeZoneSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import { updateInvoiceSelector } from 'redux/selectors/invoicesSelector';
import { PatientPurchaseDiscounted } from 'types';
import PatientPurchaseListFooter from './PatientPurchaseListFooter';
import PatientPurchaseRow from './PatientPurchaseRow';
import styles from './PatientPurchasesList.module.scss';
import {
  dispatchFetchPatientPurchases,
  dispatchUndoPayment,
} from './PatientPurchasesList.reducer';
import { patientPurchasesListSelector } from './PatientPurchasesList.selector';

type CurrencyFilter = {
  totalAmount: number;
  totalDebts: number;
  totalPrepayments: number;
  totalDiscounted?: number;
};

const getDiscountedAmount = (price: number, discount: number): number => {
  return price * (1 - parseFloat(`${discount < 10 ? '0.0' : '0.'}${discount}`));
};

const currentWeek = getCurrentWeek(new Date());

const PatientPurchasesList = ({ patient }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const updateInvoice = useSelector(updateInvoiceSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const { isLoading, payments } = useSelector(patientPurchasesListSelector);
  const clinicTimeZone = useSelector(clinicTimeZoneSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const [undoModal, setUndoModal] = useState({ open: false, payment: null });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    new Date(currentWeek[0]),
    new Date(currentWeek[currentWeek.length - 1]),
  ]);

  const dateRangeString = useMemo(() => {
    return `${formatInTimeZone(
      dateRange[0],
      clinicTimeZone,
      'dd MM yyyy',
    )} - ${formatInTimeZone(dateRange[1], clinicTimeZone, 'dd MM yyyy')}`;
  }, [dateRange]);

  useEffect(() => {
    if (patient != null) {
      fetchPurchases();
    }
  }, [patient]);

  const discountedPayments = useMemo(() => {
    return payments.map((payment) => ({
      ...payment,
      discountedTotal: getDiscountedAmount(payment.total, payment.discount),
    })) as PatientPurchaseDiscounted[];
  }, [payments.length]);

  useEffect(() => {
    if (updateInvoice?.patientId !== patient?.id) {
      return;
    }
    fetchPurchases();
  }, [updateInvoice]);

  const fetchPurchases = () => {
    dispatch(dispatchFetchPatientPurchases(patient.id));
  };

  const handleUndoPayment = (payment) => {
    setUndoModal({ open: true, payment });
  };

  const handleCancelUndoPayment = () => {
    setUndoModal({ open: false, payment: null });
  };

  const handleConfirmUndoPayment = () => {
    const { payment } = undoModal;
    dispatch(dispatchUndoPayment(payment.id));
    setUndoModal({ open: false, payment: null });
  };

  const { totalAmount, totalDebts, totalPrepayments } = useMemo(() => {
    const filteredByCurrencies: {
      [key: string]: CurrencyFilter;
    } = {};

    discountedPayments.forEach((payment) => {
      const currencyData = filteredByCurrencies[payment.currency];
      const total = (currencyData?.totalAmount ?? 0) + payment.total;
      const discountedTotal =
        (currencyData?.totalDiscounted ?? 0) + payment.discountedTotal;
      const totalPaymentsMade = payment.payments.reduce(
        (sum, detailedPayment) => sum + detailedPayment.amount,
        0,
      );
      const debts = payment.discountedTotal - totalPaymentsMade;
      const prepayments = discountedTotal - total;

      if (currencyData) {
        filteredByCurrencies[payment.currency] = {
          totalAmount: total,
          totalDebts: currencyData.totalDebts + debts > 0 ? debts : 0,
          totalPrepayments:
            currencyData.totalPrepayments + prepayments > 0 ? prepayments : 0,
          totalDiscounted: discountedTotal,
        };
      } else {
        filteredByCurrencies[payment.currency] = {
          totalAmount: total,
          totalDebts: debts > 0 ? debts : 0,
          totalPrepayments: prepayments > 0 ? prepayments : 0,
          totalDiscounted: discountedTotal,
        };
      }
    });

    const totalAmount: Array<string> = [];
    const totalDebts: Array<string> = [];
    const totalPrepayments: Array<string> = [];

    Object.keys(filteredByCurrencies).forEach((key) => {
      const data = filteredByCurrencies[key];
      totalAmount.push(formattedAmount(data.totalAmount, key));
      totalDebts.push(formattedAmount(data.totalDebts, key));
      totalPrepayments.push(formattedAmount(data.totalPrepayments, key));
    });

    return {
      totalAmount,
      totalDebts,
      totalPrepayments,
    };
  }, [discountedPayments.length, clinicCurrency, payments.length]);

  const openRangePicker = () => {
    setPickerOpen(true);
  };

  const closeRangePicker = () => {
    setPickerOpen(false);
  };

  const handleDateChange = (data: {
    range1: { startDate: Date; endDate: Date };
  }) => {
    const { startDate, endDate } = data.range1;
    setDateRange([startDate, endDate]);
  };

  const handleDownloadReport = () => {
    const startTime = formatInTimeZone(
      dateRange[0],
      clinicTimeZone,
      'yyyy-MM-dd',
    );
    const endTime = formatInTimeZone(
      dateRange[1],
      clinicTimeZone,
      'yyyy-MM-dd',
    );

    axios
      .get(
        `${updatedServerUrl()}/reports/payments/${
          patient.id
        }?startDate=${startTime}&endDate=${endTime}`,
        {
          headers: {
            [HeaderKeys.authorization]: String(authToken),
            [HeaderKeys.clinicId]: String(currentClinic.id),
          },
          responseType: 'blob',
        },
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className={styles.patientPurchasesList}>
      <ConfirmationModal
        show={undoModal.open}
        title={textForKey('undo_payment')}
        message={textForKey('undo_payment_confirm_message')}
        onClose={handleCancelUndoPayment}
        onConfirm={handleConfirmUndoPayment}
      />
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('payments')}
      </Typography>
      {isLoading && (
        <CircularProgress classes={{ root: 'circular-progress-bar' }} />
      )}
      {payments.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('no data here yet')} :(
        </Typography>
      )}
      {!isLoading && payments.length > 0 && (
        <>
          <StatisticFilter onUpdate={handleDownloadReport}>
            <EASTextField
              fullWidth
              containerClass={styles.selectControlRoot}
              onPointerUp={openRangePicker}
              ref={pickerRef}
              value={dateRangeString}
              readOnly
              fieldLabel={textForKey('period')}
            />
          </StatisticFilter>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>{textForKey('date')}</TableCell>
                  <TableCell>{textForKey('services')}</TableCell>
                  <TableCell>{textForKey('discount')}</TableCell>
                  <TableCell>{textForKey('paid')}</TableCell>
                  <TableCell>
                    {`${textForKey('total')} - ${textForKey(
                      'discount',
                    ).toLowerCase()}`}
                  </TableCell>
                  <TableCell>{textForKey('total')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {discountedPayments.map((payment) => (
                  <PatientPurchaseRow
                    payment={payment}
                    key={payment.id}
                    handleUndoPayment={handleUndoPayment}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <PatientPurchaseListFooter
                  totalCost={totalAmount}
                  totalDebts={totalDebts}
                  totalPrepayment={totalPrepayments}
                />
              </TableFooter>
            </Table>
          </TableContainer>
          {pickerOpen && (
            <EasyDateRangePicker
              open={pickerOpen}
              onClose={closeRangePicker}
              onChange={handleDateChange}
              pickerAnchor={pickerRef}
              dateRange={{
                startDate: dateRange[0],
                endDate: dateRange[1],
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PatientPurchasesList;

PatientPurchasesList.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.number,
  }),
};
