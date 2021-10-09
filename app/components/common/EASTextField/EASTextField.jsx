import React, { useState } from "react";
import clsx from "clsx";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import styles from './EASTextField.module.scss'
import { TextField } from "@material-ui/core";

const EASTextField = React.forwardRef(
  (
    {
      fieldLabel,
      readOnly,
      containerClass,
      fieldClass,
      error,
      endAdornment,
      onChange,
      helperText,
      type,
      autoFocus,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const handleFieldChange = (event) => {
      if (type === 'file') {
        onChange?.(event);
      } else {
        onChange?.(event.target.value);
      }
    };

    const handleFocusChange = (isFocused) => {
      setFocused(isFocused);
    };

    return (
      <div
        className={
          clsx(
            styles.root,
            containerClass,
            {
              [styles.readOnly]: readOnly
            }
          )
        }
        ref={ref}
      >
        {fieldLabel && (
          <Typography
            className={clsx(
              styles.formLabel,
              {
                [styles.focused]: focused && !error,
                [styles.error]: error,
              }
            )}
          >
            {fieldLabel}
          </Typography>
        )}
        <TextField
          {...rest}
          type={type}
          variant="outlined"
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
            }
          }}
          classes={{
            root: clsx(styles.searchField, fieldClass),
          }}
          InputProps={{
            endAdornment: endAdornment,
            classes: {
              root: clsx(styles.searchField, fieldClass),
              input: styles.searchInput,
              notchedOutline: styles.focusedInput,
              error: styles.errorField,
              focused: styles.focusedField,
              adornedEnd: styles.inputAdornedEnd,
            }
          }}
        />
      </div>
    )
  }
)

export default EASTextField;
