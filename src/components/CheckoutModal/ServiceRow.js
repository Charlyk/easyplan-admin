import React, { useState } from 'react';

import {
  Box,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import IconMinus from '../../assets/icons/iconMinus';
import IconPlus from '../../assets/icons/iconPlus';
import IconTrash from '../../assets/icons/iconTrash';
import { clinicExchangeRatesSelector } from '../../redux/selectors/clinicSelector';
import { adjustValueToNumber } from '../../utils/helperFuncs';

const ServiceRow = ({ service, canEdit, canDelete, onChange, onDelete }) => {
  const [currency, setCurrency] = useState(service.currency);
  const [price, setPrice] = useState(service.amount);
  const [count, setCount] = useState(service.count);
  const currencies = useSelector(clinicExchangeRatesSelector);

  const handleCurrencyChange = event => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);
    onChange({ ...service, currency: newCurrency });
  };

  const handlePriceChange = event => {
    const newPrice = adjustValueToNumber(event.target.value, Number.MAX_VALUE);
    onChange({ ...service, amount: newPrice });
    setPrice(newPrice);
  };

  const handleDeleteService = () => {
    onDelete(service);
  };

  const handleServiceCountChange = buttonId => () => {
    switch (buttonId) {
      case 'plus': {
        const newCount = count + 1;
        setCount(newCount);
        onChange({ ...service, count: newCount });
        break;
      }
      case 'minus': {
        let newCount = count - 1;
        if (newCount < 1) {
          newCount = 1;
        }
        setCount(newCount);
        onChange({ ...service, count: newCount });
        break;
      }
    }
  };

  const serviceTitle = () => {
    let name = service.name;
    if (service.toothId != null) {
      name = `${name} ${service.toothId}`;
    }
    if (service.destination != null) {
      name = `${name} (${service.destination})`;
    }
    return name;
  };

  return (
    <TableRow classes={{ root: 'services-table__body__row' }}>
      <TableCell
        classes={{ root: clsx('services-table__body__row__cell', 'name') }}
      >
        <Tooltip title={serviceTitle()}>
          <Typography noWrap classes={{ root: 'service-name' }}>
            {serviceTitle()}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell
        align='right'
        classes={{ root: clsx('services-table__body__row__cell', 'count') }}
      >
        <Box display='flex' alignItems='center' width='80px'>
          <IconButton
            disabled={!canEdit}
            classes={{ root: 'action-button ' }}
            onClick={handleServiceCountChange('minus')}
          >
            <IconMinus fill='#3A83DC' />
          </IconButton>
          <Typography classes={{ root: 'counter-label' }}>{count}</Typography>
          <IconButton
            disabled={!canEdit}
            classes={{ root: 'action-button ' }}
            onClick={handleServiceCountChange('plus')}
          >
            <IconPlus fill='#3A83DC' />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell
        align='right'
        classes={{ root: clsx('services-table__body__row__cell', 'price') }}
      >
        <TextField
          disabled={!canEdit}
          id='standard-number'
          type='number'
          value={String(price)}
          onChange={handlePriceChange}
          variant='outlined'
          classes={{ root: 'price-input' }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </TableCell>
      <TableCell
        align='right'
        classes={{ root: clsx('services-table__body__row__cell', 'currency') }}
      >
        <TextField
          disabled={!canEdit}
          classes={{ root: 'currency-input' }}
          select
          value={currency || 'MDL'}
          onChange={handleCurrencyChange}
          variant='outlined'
        >
          {currencies.map(option => (
            <MenuItem
              classes={{ root: 'checkout-modal-currency-item' }}
              key={option.currency}
              value={option.currency}
            >
              {option.currency}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
      {canDelete && (
        <TableCell
          size='small'
          classes={{ root: clsx('services-table__body__row__cell', 'delete') }}
        >
          <IconButton
            classes={{ root: 'delete-service-button' }}
            onClick={handleDeleteService}
          >
            <IconTrash />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ServiceRow;

ServiceRow.propTypes = {
  service: PropTypes.object,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

ServiceRow.defaultProps = {
  canEdit: true,
  canDelete: false,
  onDelete: () => null,
  onChange: () => null,
};
