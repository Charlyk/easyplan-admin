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
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const handleFieldChange = (event) => {
      onChange?.(event.target.value);
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
          <Typography className={clsx(styles.formLabel, { [styles.focused]: focused })}>
            {fieldLabel}
          </Typography>
        )}
        <TextField
          {...rest}
          variant="outlined"
          error={error}
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
