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
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setPaymentModal } from '../../../redux/actions/actions';
import { updatePatientPaymentsSelector } from '../../../redux/selectors/rootSelector';
import dataAPI from '../../../utils/api/dataAPI';
import { formattedAmount } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';

const PatientDebtsList = ({ patient, viewInvoice, onDebtShowed }) => {
  const dispatch = useDispatch();
  const updatePayments = useSelector(updatePatientPaymentsSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    if (patient != null) {
      fetchDebts();
    }
  }, [patient, updatePayments]);

  useEffect(() => {
    if (viewInvoice == null) {
      setDebts(
        debts.map(item => ({
          ...item,
          isHighlighted: false,
        })),
      );
    }
  }, [viewInvoice]);

  const fetchDebts = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchPatientDebts(patient.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      setDebts(
        response.data.map(item => ({
          ...item,
          isHighlighted: viewInvoice?.id === item.id,
        })),
      );

      setTimeout(onDebtShowed, 600);
    }
    setIsLoading(false);
  };

  const handlePayDebt = async debt => {
    dispatch(setPaymentModal({ open: true, invoice: debt }));
  };

  const getInvoiceTotalAmount = invoice => {
    const discountAmount = invoice.totalAmount * (invoice.discount / 100);
    return invoice.totalAmount - discountAmount;
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
                  <TableCell align='left'>{textForKey('Services')}</TableCell>
                  <TableCell align='right'>{textForKey('Date')}</TableCell>
                  <TableCell align='right'>{textForKey('Clinic')}</TableCell>
                  <TableCell align='right'>{textForKey('Total')}</TableCell>
                  <TableCell align='right'>{textForKey('Remained')}</TableCell>
                  <TableCell align='right'>{textForKey('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debts.map(item => (
                  <TableRow
                    key={item.id}
                    className={clsx(item.isHighlighted && 'highlight')}
                  >
                    <TableCell align='left'>
                      {item.services.join(', ')}
                    </TableCell>
                    <TableCell align='right'>
                      {moment(item.created).format('DD MMM YYYY HH:MM')}
                    </TableCell>
                    <TableCell align='right'>{item.clinicName}</TableCell>
                    <TableCell align='right' classes={{ root: 'amount-cell' }}>
                      {formattedAmount(
                        getInvoiceTotalAmount(item),
                        item.currency,
                      )}
                    </TableCell>
                    <TableCell align='right' classes={{ root: 'amount-cell' }}>
                      {formattedAmount(item.remainedAmount, item.currency)}
                    </TableCell>
                    <TableCell align='right'>
                      <Box
                        flex='1'
                        display='flex'
                        alignItems='center'
                        justifyContent='flex-end'
                      >
                        <Button
                          variant='outline-primary'
                          onClick={() => handlePayDebt(item)}
                        >
                          {textForKey('Pay')}
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
  onDebtShowed: PropTypes.func,
  viewInvoice: PropTypes.object,
  patient: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

PatientDebtsList.defaultProps = {
  onDebtShowed: () => null,
};
