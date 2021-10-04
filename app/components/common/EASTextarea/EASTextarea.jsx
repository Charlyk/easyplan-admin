import React, { useState } from "react";
import styles from './EASTextarea.module.scss';
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const EASTextarea = ({ fieldLabel, containerClass, value, error, type, helperText, onChange }) => {
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
        error={error}
        type={type}
        value={value}
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
