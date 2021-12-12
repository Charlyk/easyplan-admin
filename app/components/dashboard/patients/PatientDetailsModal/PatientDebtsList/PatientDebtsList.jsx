import React, { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import IconPrint from 'app/components/icons/iconPrint';
import NotificationsContext from 'app/context/notificationsContext';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { baseApiUrl } from 'eas.config';
import { getPatientDebts } from 'middleware/api/patients';
import { setPaymentModal } from 'redux/actions/actions';
import { updateInvoiceSelector } from 'redux/selectors/invoicesSelector';
import styles from './PatientDebtsList.module.scss';

const PatientDebtsList = ({ patient, viewInvoice, onDebtShowed }) => {
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const updateInvoice = useSelector(updateInvoiceSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    if (patient != null) {
      fetchDebts();
    }
  }, [patient]);

  useEffect(() => {
    if (updateInvoice == null) {
      return;
    }
    const newDebts = debts.map((item) => {
      if (item.id !== updateInvoice.id) {
        return item;
      }
      return updateInvoice;
    });
    setDebts(newDebts);
  }, [updateInvoice]);

  useEffect(() => {
    if (viewInvoice == null) {
      setDebts(
        debts.map((item) => ({
          ...item,
          isHighlighted: false,
        })),
      );
    }
  }, [viewInvoice]);

  const fetchDebts = async () => {
    setIsLoading(true);
    try {
      const response = await getPatientDebts(patient.id);
      setDebts(
        response.data.map((item) => ({
          ...item,
          isHighlighted: viewInvoice?.id === item.id,
        })),
      );
      setTimeout(onDebtShowed, 600);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayDebt = async (debt) => {
    dispatch(
      setPaymentModal({
        open: true,
        invoice: debt,
        openPatientDetailsOnClose: true,
        schedule: null,
        isNew: false,
      }),
    );
  };

  const getInvoiceTotalAmount = (invoice) => {
    const discountAmount = invoice.totalAmount * (invoice.discount / 100);
    return invoice.totalAmount - discountAmount;
  };

  return (
    <div className={styles['patient-debts-list']}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Debts')}
      </Typography>
      {isLoading && (
        <CircularProgress classes={{ root: 'circular-progress-bar' }} />
      )}
      {debts.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :)
        </Typography>
      )}
      <div className={styles['patient-debts-list__data-container']}>
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
                {debts.map((item) => (
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
                        <a
                          href={`${baseApiUrl}/invoices/receipt/${item.id}?mode=invoice`}
                          target='_blank'
                          rel='noreferrer'
                          style={{ marginRight: '.5rem' }}
                        >
                          <IconPrint fill='#3A83DC' />
                        </a>
                        <Button
                          variant='outlined'
                          classes={{
                            root: styles.payButton,
                            outlined: styles.outlinedBtnBlue,
                            label: styles.buttonLabel,
                          }}
                          onPointerUp={() => handlePayDebt(item)}
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
