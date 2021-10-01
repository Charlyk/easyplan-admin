import React, { useState } from "react";
import clsx from "clsx";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import styles from './EASTextField.module.scss'

const EASTextField = React.forwardRef(
  (
    {
      fieldLabel,
      readOnly,
      containerClass,
      error,
      endAdornment,
      onChange,
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
        <OutlinedInput
          {...rest}
          error={error}
          onFocus={() => handleFocusChange(true)}
          onBlur={() => handleFocusChange(false)}
          disabled={readOnly}
          onChange={handleFieldChange}
          endAdornment={endAdornment}
          classes={{
            root: styles.searchField,
            input: styles.searchInput,
            notchedOutline: styles.focusedInput,
            focused: styles.focusedField,
            adornedEnd: styles.inputAdornedEnd
          }}
        />
      </div>
    )
  }
)

export default EASTextField;
