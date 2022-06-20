import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { textAreaMaxCharLength } from 'app/utils/constants';
import { EASTextFieldProps } from '../EASTextField/EASTextField.types';
import styles from './EASTextarea.module.scss';

const EASTextarea: React.FC<EASTextFieldProps> = ({
  fieldLabel,
  disabled,
  containerClass,
  placeholder,
  value,
  error,
  type,
  helperText,
  maxRows,
  maxLength = textAreaMaxCharLength,
  rows,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocusChange = (isFocused: boolean): void => {
    setFocused(isFocused);
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange?.(event.target.value);
  };

  return (
    <div className={clsx(styles.textareaRoot, containerClass)}>
      {fieldLabel && (
        <Typography
          className={clsx(styles.formLabel, { [styles.focused]: focused })}
        >
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
        maxRows={maxRows}
        minRows={rows}
        helperText={helperText}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
        variant='outlined'
        onChange={handleValueChange}
        FormHelperTextProps={{
          classes: {
            root: styles.helperText,
            error: clsx(styles.helperText, styles.error),
          },
        }}
        InputProps={{
          inputProps: {
            maxLength: maxLength,
          },
          classes: {
            root: styles.textInput,
            multiline: styles.multilineRoot,
            notchedOutline: styles.focusedInput,
            focused: styles.focusedField,
            inputMultiline: styles.multilineInput,
          },
        }}
        classes={{
          root: styles.fieldRoot,
        }}
      />
    </div>
  );
};

export default EASTextarea;
