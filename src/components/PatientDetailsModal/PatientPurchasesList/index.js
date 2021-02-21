import React, { useEffect, useReducer } from 'react';

import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconPrint from '../../../assets/icons/iconPrint';
import { clinicCurrencySelector } from '../../../redux/selectors/clinicSelector';
import { updateInvoiceSelector } from '../../../redux/selectors/invoicesSelector';
import dataAPI, { baseURL } from '../../../utils/api/dataAPI';
import {
  formattedAmount,
  generateReducerActions,
} from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import styles from './PatientPurchasesList.module.scss'

const initialState = {
  isLoading: false,
  payments: [],
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setPayments: 'setPayments',
};

const actions = generateReducerActions(reducerTypes);

/**
 * Patients purchases reducer
 * @param {Object} state
 * @param {{ type: string, payload: any}} action
 */
const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setPayments:
      return { ...state, payments: action.payload };
    default:
      return state;
  }
};

const PatientPurchasesList = ({ patient }) => {
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
    const response = await dataAPI.getPatientPurchases(patient.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setPayments(response.data));
      console.log(response.data);
    }
    localDispatch(actions.setIsLoading(false));
  };

  const getAmount = (payment) => {
    return formattedAmount(payment.amount, payment.currency);
  };

  const totalAmount = formattedAmount(
    sumBy(payments, (item) => item.amount),
    clinicCurrency,
  );

  return (
    <div className={styles['patient-purchases-list']}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Payments')}
      </Typography>
      {isLoading && <CircularProgress classes={{ root: 'circular-progress-bar' }} />}
      {payments.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className='patient-payments-list__data-container'>
        {!isLoading && payments.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('Received by')}</TableCell>
                  <TableCell>{textForKey('Date')}</TableCell>
                  <TableCell>{textForKey('Paid for')}</TableCell>
                  <TableCell align='right'>{textForKey('Amount')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.userName}</TableCell>
                    <TableCell>
                      {moment(payment.created).format('DD MMM YYYY HH:mm')}
                    </TableCell>
                    <TableCell>
                      {payment.comment || textForKey('Appointment')}
                    </TableCell>
                    <TableCell align='right' classes={{ root: 'amount-cell' }}>
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='flex-end'
                      >
                        {getAmount(payment)}
                        <a
                          href={`${baseURL}/invoices/receipt/${payment.invoiceId}?mode=invoice`}
                          target='_blank'
                          rel='noreferrer'
                          style={{ marginLeft: '.5rem' }}
                        >
                          <IconPrint fill='#3A83DC' />
                        </a>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    align='right'
                    colSpan={4}
                    style={{ borderBottom: 'none' }}
                  >
                    <Box
                      display='flex'
                      width='100%'
                      alignItems='center'
                      justifyContent='flex-end'
                    >
                      <Typography classes={{ root: 'totals-text' }}>
                        {textForKey('Total')}:
                      </Typography>
                      <Typography
                        classes={{ root: 'totals-text totals-amount' }}
                      >
                        {totalAmount}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default PatientPurchasesList;

PatientPurchasesList.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.number,
  }),
};
