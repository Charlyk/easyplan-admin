import React from 'react';

import {
  CircularProgress,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { textForKey } from '../../utils/localization';

const DetailsRow = ({
  title,
  value,
  isValueInput,
  options,
  valuePlaceholder,
  clickableValue,
  isLoading,
  searchable,
  onValueClick,
  onSearch,
  onValueSelected,
}) => {
  const handleValueClick = () => {
    if (!clickableValue) {
      return;
    }
    onValueClick();
  };

  const autocompleteInput = params => {
    return (
      <TextField
        {...params}
        placeholder={valuePlaceholder}
        value={value.name}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {isLoading && (
                <CircularProgress
                  classes={{ root: 'searching-progress' }}
                  size={20}
                />
              )}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    );
  };

  const autocompleteOption = option => {
    return (
      <Typography
        id={option.id}
        classes={{ root: 'autocomplete-root-option-label' }}
      >
        {option.name}
      </Typography>
    );
  };

  const getOptionLabel = option => option.name;

  const filterValues = (options, params) => {
    return options.filter(item => {
      const [firstName, lastName] = item.name.toLowerCase().split(' ');
      return (
        params.inputValue.length === 0 ||
        params.inputValue.toLowerCase().includes(firstName) ||
        params.inputValue.toLowerCase().includes(lastName)
      );
    });
  };

  const getOptionSelected = (option, value) => {
    return option.id === value.id;
  };

  return (
    <TableRow classes={{ root: 'details-table__row' }}>
      <TableCell
        classes={{
          root: clsx('details-table__row__cell', 'title'),
        }}
      >
        <Typography classes={{ root: 'text' }}>{title}</Typography>
      </TableCell>
      <TableCell
        classes={{
          root: clsx('details-table__row__cell', { field: isValueInput }),
        }}
      >
        {isValueInput ? (
          <Autocomplete
            classes={{
              root: 'autocomplete-root',
              inputRoot: 'autocomplete-root__input-root',
            }}
            noOptionsText={
              searchable
                ? textForKey('Type to search')
                : textForKey('No options')
            }
            loading={isLoading}
            onInputChange={onSearch}
            getOptionSelected={getOptionSelected}
            getOptionLabel={getOptionLabel}
            renderOption={autocompleteOption}
            onChange={onValueSelected}
            id='details-row-autocomplete'
            renderInput={autocompleteInput}
            options={options}
            filterOptions={filterValues}
          />
        ) : (
          <Typography
            onClick={handleValueClick}
            classes={{
              root: clsx('text', {
                'clickable-value': clickableValue,
              }),
            }}
          >
            {value.name}
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DetailsRow;

DetailsRow.propTypes = {
  title: PropTypes.string,
  value: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  isValueInput: PropTypes.bool,
  valuePlaceholder: PropTypes.string,
  searchable: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  clickableValue: PropTypes.bool,
  onValueClick: PropTypes.func,
  onSearch: PropTypes.func,
  onValueSelected: PropTypes.func,
};

DetailsRow.defaultProps = {
  onValueClick: () => null,
  onSearch: () => null,
  onValueSelected: () => null,
  clickableValue: false,
  options: [],
  valuePlaceholder: '',
  isValueInput: false,
  isLoading: false,
  searchable: false,
};
