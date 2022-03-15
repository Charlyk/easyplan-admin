import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import IconMinus from 'app/components/icons/iconMinus';
import IconPlus from 'app/components/icons/iconPlus';
import IconTrash from 'app/components/icons/iconTrash';
import { textForKey } from 'app/utils/localization';
import styles from './ServiceRow.module.scss';

const ServiceRow = ({
  service,
  currencies,
  canEdit,
  canDelete,
  onChange,
  onDelete,
}) => {
  const [currency, setCurrency] = useState(service.currency);
  const [price, setPrice] = useState(service.amount);
  const [count, setCount] = useState(service.count);

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);
    onChange({ ...service, currency: newCurrency });
  };

  const handlePriceChange = ({ floatValue }) => {
    const newPrice = floatValue;
    onChange({ ...service, amount: newPrice });
    setPrice(newPrice);
  };

  const handleDeleteService = () => {
    onDelete(service);
  };

  const handleServiceCountChange = (buttonId) => () => {
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
      name = `${name} (${textForKey(service.destination)})`;
    }
    return name;
  };

  return (
    <TableRow classes={{ root: styles.serviceRow }}>
      <TableCell classes={{ root: clsx(styles.cell, styles.name) }}>
        <Tooltip title={serviceTitle()}>
          <Typography noWrap classes={{ root: styles['service-name'] }}>
            {serviceTitle()}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell
        align='right'
        classes={{ root: clsx(styles.cell, styles.count) }}
      >
        <Box display='flex' alignItems='center' width='80px'>
          <IconButton
            disabled={!canEdit}
            classes={{ root: styles['action-button'] }}
            onClick={handleServiceCountChange('minus')}
          >
            <IconMinus fill='#3A83DC' />
          </IconButton>
          <Typography classes={{ root: styles['counter-label'] }}>
            {count}
          </Typography>
          <IconButton
            disabled={!canEdit}
            classes={{ root: styles['action-button'] }}
            onClick={handleServiceCountChange('plus')}
          >
            <IconPlus fill='#3A83DC' />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell
        align='right'
        classes={{ root: clsx(styles.cell, styles.price) }}
      >
        <NumberFormat
          disabled={!canEdit}
          maxLength={10}
          placeholder='0'
          className={styles['price-input']}
          onValueChange={handlePriceChange}
          value={price || ''}
        />
      </TableCell>
      <TableCell
        align='right'
        classes={{ root: clsx(styles.cell, styles.currency) }}
      >
        <TextField
          disabled={!canEdit}
          classes={{ root: styles['currency-input'] }}
          select
          value={currency || 'MDL'}
          onChange={handleCurrencyChange}
          variant='outlined'
        >
          {currencies.map((option) => (
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
          classes={{ root: clsx(styles.cell, styles.delete) }}
        >
          <IconButton
            classes={{ root: styles['delete-service-button'] }}
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
