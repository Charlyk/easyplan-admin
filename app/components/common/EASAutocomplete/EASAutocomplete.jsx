import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";
import styles from './EASAutocomplete.module.scss';
import { textForKey } from "../../../../utils/localization";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const EASAutocomplete = (
  {
    options,
    loading,
    disabled,
    placeholder,
    value,
    fieldLabel,
    containerClass,
    onTextChange,
    onChange
  }
) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleFocusChange = (isFocused) => {
    setFocused(isFocused);
  };

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
              {loading ? <CircularProgress size={20} className={styles.progressBar} /> : null}
              {params.InputProps.endAdornment}
            </>
          )
        }}
      />
    )
  };

  const getOptionLabel = (option) => {
    return option.name || '';
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
          disabled={disabled}
          open={open}
          value={value}
          options={options}
          loading={loading}
          placeholder={placeholder}
          renderInput={renderInput}
          getOptionLabel={getOptionLabel}
          noOptionsText={textForKey('No options')}
          onChange={onChange}
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
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  fieldLabel: PropTypes.string,
  containerClass: PropTypes.any,
  options: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    label: PropTypes.string
  }),
  onChange: PropTypes.func,
  onTextChange: PropTypes.func,
}
