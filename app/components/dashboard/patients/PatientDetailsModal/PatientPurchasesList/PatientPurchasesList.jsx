import React, { useEffect, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import IconPrint from 'app/components/icons/iconPrint';
import IconRefresh from 'app/components/icons/iconRefresh';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { baseApiUrl } from 'eas.config';
import {
  clinicCurrencySelector,
  isManagerSelector,
} from 'redux/selectors/appDataSelector';
import { updateInvoiceSelector } from 'redux/selectors/invoicesSelector';
import ConfirmationModal from '../../../../common/modals/ConfirmationModal';
import IconTrash from '../../../../icons/iconTrash';
import styles from './PatientPurchasesList.module.scss';
import {
  dispatchFetchPatientPurchases,
  dispatchUndoPayment,
} from './PatientPurchasesList.reducer';
import { patientPurchasesListSelector } from './PatientPurchasesList.selector';

const PatientPurchasesList = ({ patient }) => {
  const dispatch = useDispatch();
  const updateInvoice = useSelector(updateInvoiceSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const { isLoading, payments } = useSelector(patientPurchasesListSelector);
  const isManager = useSelector(isManagerSelector);
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
    dispatch(dispatchUndoPayment(payment.invoiceId));
    setUndoModal({ open: false, payment: null });
  };

  const getAmount = (payment) => {
    return formattedAmount(payment.amount, payment.currency);
  };

  const totalAmount = formattedAmount(
    sumBy(payments, (item) => item.amount),
    clinicCurrency,
  );

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
        {textForKey('Payments')}
      </Typography>
      {isLoading && (
        <CircularProgress classes={{ root: 'circular-progress-bar' }} />
      )}
      {payments.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      {!isLoading && payments.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{textForKey('Received by')}</TableCell>
                <TableCell>{textForKey('Date')}</TableCell>
                <TableCell>{textForKey('Paid for')}</TableCell>
                <TableCell>{textForKey('Comment')}</TableCell>
                <TableCell align='right'>{textForKey('Amount')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.userName}</TableCell>
                  <TableCell>
                    {moment(payment.created).format('DD.MM.YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    {payment.comment || textForKey('Appointment')}
                  </TableCell>
                  <TableCell>{payment.userComment ?? '-'}</TableCell>
                  <TableCell align='right' classes={{ root: 'amount-cell' }}>
                    <div
                      className='flexContainer'
                      style={{ justifyContent: 'flex-end' }}
                    >
                      {getAmount(payment)}
                      <a
                        href={`${baseApiUrl}/invoices/receipt/${payment.invoiceId}?mode=invoice`}
                        target='_blank'
                        rel='noreferrer'
                        style={{ marginLeft: '.5rem' }}
                      >
                        <IconPrint fill='#3A83DC' />
                      </a>
                      {isManager && (
                        <Tooltip title={textForKey('undo_payment')}>
                          <IconButton
                            disableRipple
                            className={styles.undoButton}
                            onClick={() => handleUndoPayment(payment)}
                          >
                            {payment.scheduleId ? (
                              <IconRefresh fill='#3A83DC' />
                            ) : (
                              <IconTrash fill='#ec3276' />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  align='right'
                  colSpan={5}
                  style={{ borderBottom: 'none' }}
                >
                  <div
                    className='flexContainer'
                    style={{ width: '100%', justifyContent: 'flex-end' }}
                  >
                    <Typography classes={{ root: 'totals-text' }}>
                      {textForKey('Total')}:
                    </Typography>
                    <Typography
                      classes={{
                        root: clsx('totals-text', styles.totalsAmount),
                      }}
                    >
                      {totalAmount}
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
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
