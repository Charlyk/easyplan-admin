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
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconClose from '../../assets/icons/iconClose';
import {
  allCurrenciesSelector,
  clinicCurrencySelector,
} from '../../redux/selectors/clinicSelector';
import {
  selectedClinicSelector,
  updateExchangeRatesSelector,
} from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Role } from '../../utils/constants';
import {
  adjustValueToNumber,
  fetchClinicData,
  generateReducerActions,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import authManager from '../../utils/settings/authManager';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const initialState = {
  isLoading: true,
  isSaving: false,
  rates: [{ currency: 'EUR', value: 19.57 }],
  initialRates: [],
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setRates: 'setRates',
  setInitialRates: 'setInitialRates',
  setIsSaving: 'setIsSaving',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setRates:
      return { ...state, rates: action.payload };
    case reducerTypes.setInitialRates:
      return { ...state, initialRates: action.payload };
    case reducerTypes.setIsSaving:
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};

const ExchangeRates = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const updateRates = useSelector(updateExchangeRatesSelector);
  const allCurrencies = useSelector(allCurrenciesSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const selectedClinic = useSelector(selectedClinicSelector);
  const [{ isLoading, rates, isSaving }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    debounceFetchClinic();
  }, [updateRates, open, clinicCurrency, selectedClinic]);

  const fetchExchangeRates = async () => {
    if (
      !authManager.isLoggedIn() ||
      selectedClinic == null ||
      selectedClinic.roleInClinic === Role.doctor
    ) {
      return;
    }
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchClinicExchangeRates();
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const sortedItems = sortBy(response.data, item => item.created);
      localDispatch(actions.setRates(sortedItems));
      localDispatch(actions.setInitialRates(sortedItems));
    }
    localDispatch(actions.setIsLoading(false));
  };

  const debounceFetchClinic = useCallback(debounce(fetchExchangeRates, 50), [
    selectedClinic,
  ]);

  const handleRateCurrencyChange = rate => event => {
    const newCurrency = event.target.value;
    const newRates = rates.map(item => {
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

  const handleRateValueChange = rate => ({ floatValue }) => {
    const newRates = rates.map(item => {
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

  const handleRemoveRate = rate => () => {
    const newRates = cloneDeep(rates);
    remove(newRates, item => item.currency === rate.currency);
    localDispatch(actions.setRates(newRates));
  };

  const getAvailableCurrencies = exception => {
    if (allCurrencies == null) return [];
    const existentRates = rates.map(it => it.currency);
    return allCurrencies.filter(
      it =>
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
    const requestBody = rates.map(item => {
      if (item.value != null) {
        return item;
      }

      return {
        ...item,
        value: 1,
      };
    });
    const response = await dataAPI.updateClinicExchangeRates(requestBody);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      toast.success(textForKey('Saved successfully'));
      dispatch(fetchClinicData());
      onClose();
    }
    localDispatch(actions.setIsSaving(false));
  };

  return (
    <EasyPlanModal
      className='exchange-rates-root'
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
              {rates.map(rate => (
                <TableRow key={rate.currency}>
                  <TableCell align='center' width='33%'>
                    <Form.Group>
                      <Form.Control
                        as='select'
                        onChange={handleRateCurrencyChange(rate)}
                        value={rate.currency}
                        custom
                      >
                        {getAvailableCurrencies(rate.currency).map(currency => (
                          <option
                            key={`item-${currency.id}`}
                            value={currency.id}
                          >
                            {currency.id} - {currency.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </TableCell>
                  <TableCell align='center' width='33%'>
                    <Form.Group className='rate-form-group'>
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
                      classes={{ root: 'remove-button' }}
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
                    classes={{ root: 'add-button' }}
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

export default ExchangeRates;

ExchangeRates.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

ExchangeRates.defaultProps = {
  open: true,
  onClose: () => null,
};