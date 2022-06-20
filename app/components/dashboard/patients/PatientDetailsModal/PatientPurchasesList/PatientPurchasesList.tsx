import React, { useEffect, useState, useMemo } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import formattedAmount from 'app/utils/formattedAmount';
import { clinicCurrencySelector } from 'redux/selectors/appDataSelector';
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
};

const getDiscountedAmount = (price: number, discount: number): number => {
  return discount > 0 ? price - Math.trunc((price * discount) / 100) : price;
};

const PatientPurchasesList = ({ patient }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const updateInvoice = useSelector(updateInvoiceSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const { isLoading, payments } = useSelector(patientPurchasesListSelector);
  const [undoModal, setUndoModal] = useState({ open: false, payment: null });

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
      const totalPaymentsMade = payment.payments.reduce(
        (sum, detailedPayment) => sum + detailedPayment.amount,
        0,
      );
      const debts = total - totalPaymentsMade;
      const prepayments = totalPaymentsMade - total;
      if (currencyData) {
        filteredByCurrencies[payment.currency] = {
          totalAmount: total,
          totalDebts: currencyData.totalDebts + debts > 0 ? debts : 0,
          totalPrepayments:
            currencyData.totalPrepayments + prepayments > 0 ? prepayments : 0,
        };
      } else {
        filteredByCurrencies[payment.currency] = {
          totalAmount: total,
          totalDebts: debts > 0 ? debts : 0,
          totalPrepayments: prepayments > 0 ? prepayments : 0,
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
  }, [discountedPayments.length, clinicCurrency]);

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
