import React from "react";
import clsx from "clsx";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import styles from './EASTextField.module.scss'

const EASTextField = ({ fieldLabel, containerClass, error, onChange, ...rest }) => {
  const handleFieldChange = (event) => {
    onChange?.(event.target.value);
  };

  return (
    <div className={clsx(styles.root, containerClass)}>
      {fieldLabel && (
        <Typography className={styles.formLabel}>
          {fieldLabel}
        </Typography>
      )}
      <OutlinedInput
        {...rest}
        error={error}
        onChange={handleFieldChange}
        classes={{
          root: styles.searchField,
          input: styles.searchInput,
          notchedOutline: styles.focusedInput,
        }}
      />
    </div>
  )
}

export default EASTextField;
