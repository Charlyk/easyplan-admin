import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../utils/localization";
import styles from './EASAutocomplete.module.scss';

const EASAutocomplete = (
  {
    options,
    loading,
    disabled,
    placeholder,
    clearOnSelect,
    value,
    fieldLabel,
    containerClass,
    filterLocally,
    onTextChange,
    onChange
  }
) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [fieldKey, setFieldKey] = useState(1);

  const handleFocusChange = (isFocused) => {
    setFocused(isFocused);
  };

  const handleChange = (event, value) => {
    onChange?.(event, value);
    if (clearOnSelect) {
      setFieldKey(fieldKey + 1);
    }
  }

  const renderInput = (params) => {
    return (
      <TextField
        {...params}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
        disabled={disabled}
        placeholder={placeholder}
        variant="outlined"
        onChange={onTextChange}
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
              {loading ? <CircularProgress size={20} className={styles.progressBar}/> : null}
              {params.InputProps.endAdornment}
            </>
          )
        }}
      />
    )
  };

  const renderOption = (data) => {
    return data.name;
  }

  const getOptionLabel = (option) => {
    return option.label || '';
  }

  const filterOptions = (options, state) => {
    if (filterLocally) {
      return options.filter(item => (
        item.name.toLowerCase().includes(state.inputValue.toLowerCase())
      ))
    }
    return options;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={clsx(styles.autocompleteWrapper, containerClass)}>
        {fieldLabel && (
          <Typography className={clsx(styles.autocompleteFormLabel, { [styles.focused]: focused })}>
            {fieldLabel}
          </Typography>
        )}
        <Autocomplete
          key={fieldKey}
          disabled={disabled}
          open={open}
          value={value}
          options={options}
          filterOptions={filterOptions}
          loading={loading}
          placeholder={placeholder}
          renderInput={renderInput}
          renderOption={renderOption}
          getOptionLabel={getOptionLabel}
          noOptionsText={textForKey('No options')}
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
  )
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      key: PropTypes.any,
      name: PropTypes.string,
      label: PropTypes.string
    })
  ),
  onChange: PropTypes.func,
  onTextChange: PropTypes.func,
}
