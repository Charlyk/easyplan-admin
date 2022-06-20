import React, { useMemo, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import styles from './EASAutocomplete.module.scss';

const EASAutocomplete = ({
  options,
  loading,
  disabled,
  placeholder,
  helperText,
  error,
  clearOnSelect,
  value,
  fieldLabel,
  containerClass,
  filterLocally,
  canCreate,
  onTextChange,
  onChange,
  onCreateOption,
}) => {
  const textForKey = useTranslate();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [fieldKey, setFieldKey] = useState(1);
  const [inputValue, setInputValue] = useState(value?.label ?? '');

  const mappedOptions = useMemo(() => {
    if (canCreate && inputValue.length > 0) {
      return [
        ...options,
        {
          id: 'add',
          name: `${textForKey('create')} "${inputValue}"`,
          label: inputValue,
        },
      ];
    }
    return options;
  }, [options, canCreate, filterLocally, loading, inputValue]);

  const handleFocusChange = (isFocused) => {
    setFocused(isFocused);
  };

  const handleTextChange = (event) => {
    onTextChange?.(event);
    setInputValue(event.target.value);
  };

  const handleChange = (event, value) => {
    if (value?.id === 'add') {
      onCreateOption?.(value);
      setFieldKey(fieldKey + 1);
      setInputValue('');
      return;
    }

    onChange?.(event, value);
    if (clearOnSelect) {
      setFieldKey(fieldKey + 1);
    }
  };

  const renderInput = (params) => {
    return (
      <TextField
        {...params}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
        disabled={disabled}
        placeholder={placeholder}
        variant='outlined'
        onChange={handleTextChange}
        helperText={helperText}
        error={error}
        FormHelperTextProps={{
          classes: {
            root: styles.helperText,
          },
        }}
        InputProps={{
          ...params.InputProps,
          classes: {
            root: styles.autocompleteInputRoot,
            notchedOutline: styles.focusedInput,
            focused: styles.focusedField,
            input: styles.autocompleteInput,
            adornedEnd: styles.inputAdornedEnd,
          },
          endAdornment: (
            <>
              {loading ? (
                <CircularProgress size={20} className={styles.progressBar} />
              ) : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    );
  };

  const renderOption = (data) => {
    return data.name;
  };

  const getOptionLabel = (option) => {
    return option.label || '';
  };

  const getOptionSelected = (option, value) => {
    if (typeof option === 'object') {
      return option.id === value.id;
    }
    return option === value;
  };

  const filterOptions = (options, state) => {
    if (filterLocally) {
      return options.filter((item) =>
        item?.name.toLowerCase().includes(state.inputValue.toLowerCase()),
      );
    }
    return options;
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={clsx(styles.autocompleteWrapper, containerClass)}>
        {fieldLabel && (
          <Typography
            className={clsx(styles.autocompleteFormLabel, {
              [styles.focused]: focused,
            })}
          >
            {fieldLabel}
          </Typography>
        )}
        <Autocomplete
          key={fieldKey}
          disabled={disabled}
          open={open}
          value={value}
          options={mappedOptions}
          filterOptions={filterOptions}
          loading={loading}
          placeholder={placeholder}
          renderInput={renderInput}
          renderOption={renderOption}
          getOptionLabel={getOptionLabel}
          getOptionSelected={getOptionSelected}
          noOptionsText={textForKey('no options')}
          onChange={handleChange}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          classes={{
            root: styles.autocompleteField,
            option: styles.autocompleteResultItem,
            paper: styles.autocompleteResultPaper,
            noOptions: styles.autocompleteNoResultItem,
          }}
        />
      </div>
    </ClickAwayListener>
  );
};

export default EASAutocomplete;

EASAutocomplete.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.any,
  clearOnSelect: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  fieldLabel: PropTypes.string,
  containerClass: PropTypes.any,
  filterLocally: PropTypes.bool,
  canCreate: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      key: PropTypes.any,
      name: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func,
  onTextChange: PropTypes.func,
  onCreateOption: PropTypes.func,
};

EASAutocomplete.defaultProps = {
  loading: false,
  value: null,
  clearOnSelect: false,
  disabled: false,
  placeholder: '',
  fieldLabel: '',
  containerClass: null,
  filterLocally: false,
  canCreate: false,
  options: [],
  onChange: () => null,
  onTextChange: () => null,
  onCreateOption: () => null,
};
