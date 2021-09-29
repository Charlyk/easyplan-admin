import React from "react";
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
    const handleFieldChange = (event) => {
      onChange?.(event.target.value);
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
          <Typography className={styles.formLabel}>
            {fieldLabel}
          </Typography>
        )}
        <OutlinedInput
          {...rest}
          error={error}
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
