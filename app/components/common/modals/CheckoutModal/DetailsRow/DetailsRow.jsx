import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import styles from './DetailsRow.module.scss';

const DetailsRow = ({
  title,
  value,
  isValueInput,
  options,
  valuePlaceholder,
  clickableValue,
  isLoading,
  searchable,
  filterLocally,
  onValueClick,
  onSearch,
  onValueSelected,
}) => {
  const textForKey = useTranslate();
  const handleValueClick = () => {
    if (!clickableValue) {
      return;
    }
    onValueClick();
  };

  const autocompleteInput = (params) => {
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
                <CircularProgress classes={{ root: 'circular-progress-bar' }} />
              )}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    );
  };

  const autocompleteOption = (option) => {
    return (
      <Typography
        id={option.id}
        classes={{ root: 'autocomplete-root-option-label' }}
      >
        {option.name}
      </Typography>
    );
  };

  const getOptionLabel = (option) => option.label;

  const filterValues = (options, params) => {
    if (filterLocally) {
      return options.filter((item) => {
        const [firstName, lastName] = item.name.toLowerCase().split(' ');
        return (
          params.inputValue.length === 0 ||
          params.inputValue.toLowerCase().includes(firstName) ||
          params.inputValue.toLowerCase().includes(lastName)
        );
      });
    }
    return options;
  };

  const getOptionSelected = (option, value) => {
    return option.id === value.id;
  };

  return (
    <TableRow classes={{ root: styles['details-row'] }}>
      <TableCell
        classes={{
          root: clsx(styles.cell, styles.title),
        }}
      >
        <Typography classes={{ root: styles.text }}>{title}</Typography>
      </TableCell>
      <TableCell
        classes={{
          root: clsx(styles.cell, { [styles.field]: isValueInput }),
        }}
      >
        {isValueInput ? (
          <Autocomplete
            classes={{
              root: styles['autocomplete-root'],
              inputRoot: styles['input-root'],
            }}
            noOptionsText={
              searchable
                ? textForKey('type to search')
                : textForKey('no options')
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
              root: clsx(styles.text, {
                [styles['clickable-value']]: clickableValue,
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
