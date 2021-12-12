import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import { fetchClinicExchangeRates } from 'middleware/api/clinic';
import { setIsExchangeRatesModalOpen } from 'redux/actions/exchangeRatesActions';
import { clinicCurrencySelector } from 'redux/selectors/appDataSelector';
import { updateExchangeRatesSelector } from 'redux/selectors/rootSelector';
import styles from './ExchangeRates.module.scss';

const ExchangeRates = ({ canEdit }) => {
  const toast = useContext(NotificationsContext);
  const dispatch = useDispatch();
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const updateRates = useSelector(updateExchangeRatesSelector);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    fetchExchangeRates();
  }, [updateRates, isMounted]);

  const fetchExchangeRates = async () => {
    try {
      if (isMounted) setIsLoading(true);
      const response = await fetchClinicExchangeRates();
      const sortedItems = sortBy(response.data, (item) => item.created);
      if (isMounted) setRates(sortedItems);
    } catch (error) {
      toast.error(error.message);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleOpenExchangeRatesModal = () => {
    dispatch(setIsExchangeRatesModalOpen(true));
  };

  return (
    <div className={styles.exchangeRate}>
      {!isLoading && (
        <Typography className={styles.titleLabel}>
          {textForKey('Exchange rate')}
        </Typography>
      )}
      {!isLoading ? (
        <TableContainer className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableBody className={styles.tableBody}>
              {rates.map((rate) => (
                <TableRow className={styles.tableRow} key={rate.currency}>
                  <TableCell className={styles.tableCell}>
                    <Typography className={styles.label}>
                      {rate.currency}:
                    </Typography>
                  </TableCell>
                  <TableCell className={styles.tableCell} align='right'>
                    <Typography
                      className={clsx(styles.label, styles.valueLabel)}
                    >
                      {formattedAmount(rate.value, clinicCurrency)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className='progress-bar-wrapper'>
          <CircularProgress className='circular-progress-bar' />
        </div>
      )}
      {!isLoading && canEdit && (
        <Button
          className={styles.editButton}
          onPointerUp={handleOpenExchangeRatesModal}
        >
          {textForKey('Edit')}
        </Button>
      )}
    </div>
  );
};

export default React.memo(ExchangeRates, areComponentPropsEqual);
