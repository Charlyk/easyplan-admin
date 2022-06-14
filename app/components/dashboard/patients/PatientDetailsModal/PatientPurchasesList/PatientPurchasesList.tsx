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
import PatientPurchaseListFooter from './PatientPurchaseListFooter';
import PatientPurchaseRow from './PatientPurchaseRow';
import styles from './PatientPurchasesList.module.scss';
import {
  dispatchFetchPatientPurchases,
  dispatchUndoPayment,
} from './PatientPurchasesList.reducer';
import { patientPurchasesListSelector } from './PatientPurchasesList.selector';

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
    let total = 0;
    let totalPaymentsMade = 0;

    payments.forEach((payment) => {
      total += payment.total;
      payment.payments.forEach((madePayment) => {
        totalPaymentsMade += madePayment.amount;
      });
    });
    const debts = total - totalPaymentsMade;
    const prepayments = totalPaymentsMade - total;

    return {
      totalAmount: formattedAmount(total, clinicCurrency),
      totalDebts: formattedAmount(debts > 0 ? debts : 0, clinicCurrency),
      totalPrepayments: formattedAmount(
        prepayments > 0 ? prepayments : 0,
        clinicCurrency,
      ),
    };
  }, [payments.length, clinicCurrency]);

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
              {payments.map((payment) => (
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
