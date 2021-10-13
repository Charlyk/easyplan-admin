import React, { useState } from "react";
import styles from './EASTextarea.module.scss';
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const EASTextarea = ({ fieldLabel, disabled, containerClass, placeholder, value, error, type, helperText, maxRows, rows, onChange }) => {
  const [focused, setFocused] = useState(false);

  const handleFocusChange = (isFocused) => {
    setFocused(isFocused);
  };

  const handleValueChange = (event) => {
    onChange?.(event.target.value);
  }

  return (
    <div className={clsx(styles.textareaRoot, containerClass)}>
      {fieldLabel && (
        <Typography className={clsx(styles.formLabel, { [styles.focused]: focused })}>
          {fieldLabel}
        </Typography>
      )}
      <TextField
        multiline
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        type={type}
        value={value}
        rowsMax={maxRows}
        rows={rows}
        helperText={helperText}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
        variant="outlined"
        onChange={handleValueChange}
        FormHelperTextProps={{
          classes: {
            root: styles.helperText,
            error: clsx(styles.helperText, styles.error),
          }
        }}
        InputProps={{
          classes: {
            root: styles.textInput,
            multiline: styles.multilineRoot,
            notchedOutline: styles.focusedInput,
            focused: styles.focusedField,
            inputMultiline: styles.multilineInput,
          }
        }}
        classes={{
          root: styles.fieldRoot,
        }}
      />
    </div>
  )
};

export default EASTextarea;
