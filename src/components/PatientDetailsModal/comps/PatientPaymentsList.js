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
  TableFooter,
  Box,
} from '@material-ui/core';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import dataAPI from '../../../utils/api/dataAPI';
import { Statuses } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';

const PatientPaymentsList = ({ patient, onViewDebtClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, [patient]);

  const fetchInvoices = async () => {
    if (patient == null) return;
    setIsLoading(true);
    const response = await dataAPI.fetchPatientPayments(patient.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      setInvoices(response.data);
    }
    setIsLoading(false);
  };

  const getInvoiceStatus = item => {
    return Statuses.find(it => it.id === item.status);
  };

  const getInvoicesTotal = () => {
    return sumBy(invoices, item => item.totalAmount);
  };

  const getInvoicesPaid = () => {
    return sumBy(invoices, item => item.paidAmount);
  };

  const handleViewDebtClick = invoice => () => {
    onViewDebtClick(invoice);
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
                  <TableCell>{textForKey('Clinic')}</TableCell>
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
                      <TableCell>{item.doctor.fullName}</TableCell>
                      <TableCell style={{ width: 140 }}>
                        {item.clinic.name}
                      </TableCell>
                      <TableCell
                        align='right'
                        classes={{ root: 'amount-cell' }}
                      >
                        {item.paidAmount}MDL
                      </TableCell>
                      <TableCell align='right'>
                        <Box display='flex' flexDirection='column'>
                          <div
                            className='invoice-status'
                            style={{
                              backgroundColor: `${status.color}33`,
                              color: status.color,
                            }}
                          >
                            {status.name}
                          </div>
                          {status.id === 'PartialPaid' && (
                            <Typography
                              onClick={handleViewDebtClick(item)}
                              classes={{ root: 'view-debt-btn' }}
                            >
                              {textForKey('View debt')}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell align='right' colSpan={4}>
                    {textForKey('Total')} / {textForKey('Paid')}
                  </TableCell>
                  <TableCell align='right'>
                    {getInvoicesTotal()}MDL / {getInvoicesPaid()}MDL
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default React.memo(PatientPaymentsList);

PatientPaymentsList.propTypes = {
  onViewDebtClick: PropTypes.func,
  patient: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

PatientPaymentsList.defaultProps = {
  onViewDebtClick: () => null,
};
