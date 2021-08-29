import React, { useCallback, useEffect, useReducer } from 'react';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import axios from "axios";
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconClose from '../../icons/iconClose';
import { updateExchangeRatesSelector } from '../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../utils/localization';
import { setIsExchangeRatesModalOpen } from "../../../../redux/actions/exchangeRatesActions";
import { Role } from '../../../utils/constants';
import { fetchClinicExchangeRates } from "../../../../middleware/api/clinic";
import EasyPlanModal from '../modals/EasyPlanModal';
import { reducer, initialState, actions } from './ExchangeRatesModal.reducer';
import styles from './ExchangeRates.module.scss';

const ExchangeRatesModal = ({ open, currentClinic, currentUser, onClose }) => {
  const dispatch = useDispatch();
  const updateRates = useSelector(updateExchangeRatesSelector);
  const allCurrencies = currentClinic.allCurrencies;
  const clinicCurrency = currentClinic.currency;
  const selectedClinic = currentUser.clinics.find((item) => item.clinicId === currentClinic.id);
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
    if (
      selectedClinic == null ||
      selectedClinic.roleInClinic === Role.doctor
    ) {
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

  const handleRateValueChange = (rate) => ({ floatValue }) => {
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
    return allCurrencies.filter(
      (it) =>
        (!existentRates.includes(it.id) && it.id !== clinicCurrency) ||
        it.id === exception,
    );
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
      await axios.put(`/api/clinic/exchange-rates`, { rates: requestBody });
      toast.success(textForKey('Saved successfully'));
      dispatch(setIsExchangeRatesModalOpen(false));
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsSaving(false));
    }
  };

  return (
    <EasyPlanModal
      className={styles['exchange-rates-root']}
      open={open}
      onClose={onClose}
      isPositiveLoading={isSaving || isLoading}
      isPositiveDisabled={isLoading || isSaving}
      title={textForKey('Exchange rate')}
      onPositiveClick={handleSaveRates}
    >
      {!isLoading && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{textForKey('Currency')}</TableCell>
                <TableCell>{textForKey('Value')}</TableCell>
                <TableCell>{textForKey('Clinic currency')}</TableCell>
                <TableCell>{textForKey('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.currency}>
                  <TableCell align='center' width='33%'>
                    <Form.Group>
                      <Form.Control
                        as='select'
                        onChange={handleRateCurrencyChange(rate)}
                        value={rate.currency}
                        custom
                      >
                        {getAvailableCurrencies(rate.currency).map(
                          (currency) => (
                            <option
                              key={`item-${currency.id}`}
                              value={currency.id}
                            >
                              {currency.id} - {currency.name}
                            </option>
                          ),
                        )}
                      </Form.Control>
                    </Form.Group>
                  </TableCell>
                  <TableCell align='center' width='33%'>
                    <Form.Group className={styles['rate-form-group']}>
                      <NumberFormat
                        placeholder='0'
                        onValueChange={handleRateValueChange(rate)}
                        value={rate.value || ''}
                      />
                    </Form.Group>
                  </TableCell>
                  <TableCell align='center' width='33%'>
                    <Form.Group>
                      <Form.Control readOnly value={clinicCurrency} />
                    </Form.Group>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={handleRemoveRate(rate)}
                      classes={{ root: styles['remove-button'] }}
                    >
                      <IconClose />
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
                    {textForKey('Add Rate')}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </EasyPlanModal>
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
