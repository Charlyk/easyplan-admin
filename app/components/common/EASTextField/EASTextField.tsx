import React, { ChangeEvent, useState } from 'react';
import { TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { singleLineMaxCharLength } from 'app/utils/constants';
import styles from './EASTextField.module.scss';
import { EASTextFieldProps } from './EASTextField.types';

const EASTextField = React.forwardRef<HTMLDivElement, EASTextFieldProps>(
  (
    {
      fieldLabel,
      readOnly,
      containerClass,
      fieldClass,
      inputClass,
      error,
      max,
      min,
      maxLength = singleLineMaxCharLength,
      step,
      endAdornment,
      onChange,
      helperText,
      type,
      disableAutoFill,
      autoFocus,
      variant = 'outlined',
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (type === 'file') {
        onChange?.(event.target.files, event);
      } else {
        onChange?.(event.target.value, event);
      }
    };

    const handleFocusChange = (isFocused) => {
      setFocused(isFocused);
    };

    return (
      <div
        className={clsx(styles.root, containerClass, {
          [styles.readOnly]: readOnly,
        })}
        ref={ref}
      >
        {fieldLabel && (
          <Typography
            className={clsx(styles.formLabel, {
              [styles.focused]: focused && !error,
              [styles.error]: error,
            })}
          >
            {fieldLabel}
          </Typography>
        )}
        <TextField
          {...props}
          type={type}
          variant={variant as any}
          error={error}
          autoFocus={autoFocus}
          helperText={helperText}
          onFocus={() => handleFocusChange(true)}
          onBlur={() => handleFocusChange(false)}
          disabled={readOnly}
          onChange={handleFieldChange}
          FormHelperTextProps={{
            classes: {
              root: styles.helperText,
              error: clsx(styles.helperText, styles.error),
            },
          }}
          classes={{
            root: clsx(styles.searchField, fieldClass),
          }}
          InputProps={{
            endAdornment: endAdornment,
            inputProps: {
              readOnly: disableAutoFill ? 'readonly' : '',
              max,
              min,
              step,
              maxLength,
              onFocus: disableAutoFill
                ? (evt) => evt.target.removeAttribute('readonly')
                : () => null,
            },
            classes: {
              root: clsx(styles.searchField, fieldClass),
              input: clsx(styles.searchInput, inputClass),
              notchedOutline:
                variant === 'outlined' ? styles.focusedInput : null,
              error: styles.errorField,
              focused: styles.focusedField,
              adornedEnd:
                variant === 'outlined' ? styles.inputAdornedEnd : null,
              underline:
                variant === 'standard'
                  ? clsx(styles.underline, {
                      [styles.text]: variant === 'standard',
                    })
                  : null,
            },
          }}
        />
      </div>
    );
  },
);

EASTextField.displayName = 'EASTextField';

export default EASTextField;
