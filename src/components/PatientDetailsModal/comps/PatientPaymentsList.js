import React, { useEffect, useState } from 'react';

import {
  CircularProgress,
  Table,
  TableContainer,
  TableHead,
  Typography,
  TableCell,
  TableRow,
  TableBody,
} from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { updatePatientPaymentsSelector } from '../../../redux/selectors/rootSelector';
import dataAPI from '../../../utils/api/dataAPI';
import { Statuses } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';

const PatientPaymentsList = ({ patient }) => {
  const updatePayments = useSelector(updatePatientPaymentsSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, [updatePayments]);

  const fetchInvoices = async () => {
    if (patient == null) return;
    setIsLoading(true);
    const response = await dataAPI.fetchPatientPayments(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setInvoices(response.data);
      console.log(response.data);
    }
    setIsLoading(false);
  };

  const getInvoiceStatus = item => {
    return Statuses.find(it => it.id === item.status);
  };

  return (
    <div className='patient-payments-list'>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Payments')}
      </Typography>
      {isLoading && <CircularProgress className='patient-details-spinner' />}
      {invoices.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className='patient-payments-list__data-container'>
        {!isLoading && invoices.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('Services')}</TableCell>
                  <TableCell>{textForKey('Date')}</TableCell>
                  <TableCell>{textForKey('Doctor')}</TableCell>
                  <TableCell align='right'>{textForKey('Amount')}</TableCell>
                  <TableCell align='right'>{textForKey('Status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map(item => {
                  const status = getInvoiceStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell style={{ maxWidth: '12rem' }}>
                        {item.services.map(it => it.name).join(', ')}
                      </TableCell>
                      <TableCell>
                        {moment(item.created).format('DD MMM YYYY HH:mm')}
                      </TableCell>
                      <TableCell>{item.doctorName}</TableCell>
                      <TableCell
                        align='right'
                        classes={{ root: 'amount-cell' }}
                      >
                        {item.paid}MDL
                      </TableCell>
                      <TableCell align='right'>
                        <div
                          className='invoice-status'
                          style={{
                            backgroundColor: `${status.color}33`,
                            color: status.color,
                          }}
                        >
                          {status.name}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default PatientPaymentsList;

PatientPaymentsList.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};
