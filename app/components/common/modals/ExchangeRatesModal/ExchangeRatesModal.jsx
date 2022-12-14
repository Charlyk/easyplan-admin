import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import IconTrash from 'app/components/icons/iconTrash';
import NotificationsContext from 'app/context/notificationsContext';
import { Role } from 'app/utils/constants';
import {
  fetchClinicExchangeRates,
  requestUpdateExchangeRates,
} from 'middleware/api/clinic';
import { setIsExchangeRatesModalOpen } from 'redux/actions/exchangeRatesActions';
import { updateExchangeRatesSelector } from 'redux/selectors/rootSelector';
import EASModal from '../EASModal';
import styles from './ExchangeRates.module.scss';
import { reducer, initialState, actions } from './ExchangeRatesModal.reducer';

const ExchangeRatesModal = ({ open, currentClinic, currentUser, onClose }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const updateRates = useSelector(updateExchangeRatesSelector);
  const allCurrencies = currentClinic.allCurrencies;
  const clinicCurrency = currentClinic.currency;
  const selectedClinic = currentUser.clinics.find(
    (item) => item.clinicId === currentClinic.id,
  );
  const [{ isLoading, rates, isSaving }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (open) {
      debounceFetchClinic();
    }
  }, [updateRates, open, clinicCurrency, selectedClinic]);

  const fetchExchangeRates = async () => {
    if (selectedClinic == null || selectedClinic.roleInClinic === Role.doctor) {
      return;
    }
    localDispatch(actions.setIsLoading(true));
    try {
      const response = await fetchClinicExchangeRates();
      const sortedItems = sortBy(response.data, (item) => item.created);
      localDispatch(actions.setRates(sortedItems));
      localDispatch(actions.setInitialRates(sortedItems));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  const debounceFetchClinic = useCallback(debounce(fetchExchangeRates, 50), [
    selectedClinic,
  ]);

  const handleRateCurrencyChange = (rate) => (event) => {
    const newCurrency = event.target.value;
    const newRates = rates.map((item) => {
      if (item.currency !== rate.currency) {
        return item;
      }

      return {
        ...item,
        currency: newCurrency,
      };
    });
    localDispatch(actions.setRates(newRates));
  };

  const handleRateValueChange =
    (rate) =>
    ({ floatValue }) => {
      const newRates = rates.map((item) => {
        if (item.currency !== rate.currency) {
          return item;
        }

        return {
          ...item,
          value: floatValue,
        };
      });
      localDispatch(actions.setRates(newRates));
    };

  const handleRemoveRate = (rate) => () => {
    const newRates = cloneDeep(rates);
    remove(newRates, (item) => item.currency === rate.currency);
    localDispatch(actions.setRates(newRates));
  };

  const getAvailableCurrencies = (exception) => {
    if (allCurrencies == null) return [];
    const existentRates = rates.map((it) => it.currency);
    return allCurrencies
      .filter(
        (it) =>
          (!existentRates.includes(it.id) && it.id !== clinicCurrency) ||
          it.id === exception,
      )
      .map((item) => ({
        ...item,
        name: `${item.id} - ${item.name}`,
      }));
  };

  const handleAddExchangeRate = () => {
    const newRates = cloneDeep(rates);
    const availableRates = getAvailableCurrencies();
    if (availableRates.length > 0) {
      const newRate = { currency: availableRates[0].id, value: 0 };
      newRates.push(newRate);
      localDispatch(actions.setRates(newRates));
    }
  };

  const handleSaveRates = async () => {
    localDispatch(actions.setIsSaving(true));
    try {
      const requestBody = rates.map((item) => {
        if (item.value != null) {
          return item;
        }
        return { ...item, value: 1 };
      });
      await requestUpdateExchangeRates({ rates: requestBody });
      toast.success(textForKey('saved successfully'));
      dispatch(setIsExchangeRatesModalOpen(false));
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsSaving(false));
    }
  };

  return (
    <EASModal
      open={open}
      size='large'
      onClose={onClose}
      className={styles.exchangeRatesRoot}
      paperClass={styles.modalPaper}
      isPositiveLoading={isSaving || isLoading}
      isPositiveDisabled={isLoading || isSaving}
      title={textForKey('exchange rate')}
      onPrimaryClick={handleSaveRates}
    >
      {!isLoading && (
        <TableContainer className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{textForKey('currency')}</TableCell>
                <TableCell>{textForKey('value')}</TableCell>
                <TableCell>{textForKey('clinic currency')}</TableCell>
                <TableCell>{textForKey('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.currency}>
                  <TableCell width='33%'>
                    <EASSelect
                      value={rate.currency}
                      rootClass={styles.selectRoot}
                      options={getAvailableCurrencies(rate.currency)}
                      onChange={handleRateCurrencyChange(rate)}
                    />
                  </TableCell>
                  <TableCell width='33%'>
                    <NumberFormat
                      maxLength={10}
                      placeholder='0'
                      className={styles.numberFormatInput}
                      onValueChange={handleRateValueChange(rate)}
                      value={rate.value || ''}
                    />
                  </TableCell>
                  <TableCell width='33%'>
                    <EASTextField
                      readOnly
                      containerClass={styles.disabledInput}
                      value={clinicCurrency}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={handleRemoveRate(rate)}
                      classes={{ root: styles['remove-button'] }}
                    >
                      <IconTrash />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell valign='middle' align='center' colSpan={4}>
                  <Button
                    disabled={getAvailableCurrencies().length === 0}
                    classes={{ root: styles['add-button'] }}
                    onClick={handleAddExchangeRate}
                  >
                    {textForKey('add Rate')}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </EASModal>
  );
};

export default ExchangeRatesModal;

ExchangeRatesModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

ExchangeRatesModal.defaultProps = {
  open: true,
  onClose: () => null,
};
