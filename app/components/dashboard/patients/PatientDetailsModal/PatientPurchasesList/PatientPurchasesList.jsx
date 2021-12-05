import React, { useContext, useEffect, useReducer } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { useSelector } from 'react-redux';
import IconPrint from 'app/components/icons/iconPrint';
import NotificationsContext from 'app/context/notificationsContext';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { baseApiUrl } from 'eas.config';
import { requestFetchPatientPurchases } from 'middleware/api/patients';
import { clinicCurrencySelector } from 'redux/selectors/appDataSelector';
import { updateInvoiceSelector } from 'redux/selectors/invoicesSelector';
import styles from './PatientPurchasesList.module.scss';
import { reducer, initialState, actions } from './PatientPurchasesList.reducer';

const PatientPurchasesList = ({ patient }) => {
  const toast = useContext(NotificationsContext);
  const updateInvoice = useSelector(updateInvoiceSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const [{ isLoading, payments }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

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

  const fetchPurchases = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      const response = await requestFetchPatientPurchases(patient.id);
      localDispatch(actions.setPayments(response.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  align='right'
                  colSpan={4}
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
