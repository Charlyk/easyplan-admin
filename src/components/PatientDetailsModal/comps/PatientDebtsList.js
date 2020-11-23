import React, { useEffect, useState } from 'react';

import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { setPaymentModal } from '../../../redux/actions/actions';
import { updatePatientPaymentsSelector } from '../../../redux/selectors/rootSelector';
import dataAPI from '../../../utils/api/dataAPI';
import { textForKey } from '../../../utils/localization';

const PatientDebtsList = ({ patient }) => {
  const dispatch = useDispatch();
  const updatePayments = useSelector(updatePatientPaymentsSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [debts, setDebts] = useState([]);
  const [loadingDebt, setLoadingDebt] = useState(null);

  useEffect(() => {
    if (patient != null) {
      fetchDebts();
    }
  }, [patient, updatePayments]);

  const fetchDebts = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchPatientDebts(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setDebts(response.data);
    }
    setIsLoading(false);
  };

  const handlePayDebt = async debt => {
    setLoadingDebt(debt.invoiceId);
    const response = await dataAPI.fetchInvoiceDetails(debt.invoiceId);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(setPaymentModal({ open: true, invoice: response.data }));
    }
    setLoadingDebt(null);
  };

  return (
    <div className='patient-debts-list'>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Debts')}
      </Typography>
      {isLoading && <CircularProgress className='patient-details-spinner' />}
      {debts.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :)
        </Typography>
      )}
      <div className='patient-debts-list__data-container'>
        {!isLoading && debts.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>{textForKey('Service')}</TableCell>
                  <TableCell align='right'>{textForKey('Total')}</TableCell>
                  <TableCell align='right'>{textForKey('Remained')}</TableCell>
                  <TableCell align='right'>{textForKey('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debts.map(item => (
                  <TableRow key={item.invoiceId}>
                    <TableCell align='left'>{item.serviceName}</TableCell>
                    <TableCell align='right' classes={{ root: 'amount-cell' }}>
                      {item.amount}MDL
                    </TableCell>
                    <TableCell align='right' classes={{ root: 'amount-cell' }}>
                      {item.amount - item.paid}MDL
                    </TableCell>
                    <TableCell align='right'>
                      <Box
                        flex='1'
                        display='flex'
                        alignItems='center'
                        justifyContent='flex-end'
                      >
                        <Button
                          disabled={loadingDebt != null}
                          variant='outline-primary'
                          onClick={() => handlePayDebt(item)}
                        >
                          {loadingDebt === item.invoiceId ? (
                            <Spinner
                              animation='border'
                              className='pay-btn-spinner'
                            />
                          ) : (
                            textForKey('Pay')
                          )}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default PatientDebtsList;

PatientDebtsList.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};
