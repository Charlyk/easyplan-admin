import React, { useState } from "react";
import clsx from "clsx";
import PhoneInput from "react-phone-input-2";
import Typography from "@material-ui/core/Typography";
import isPhoneInputValid from "../../../utils/isPhoneInputValid";
import styles from './EASPhoneInput.module.scss';

const EASPhoneInput = (
  {
    value,
    fieldLabel,
    country = 'md',
    placeholder = '079123456',
    rootClass,
    onChange
  }
) => {
  const [focused, setFocused] = useState(false);

  const handleFocusChange = (isFocused) => {
    setFocused(isFocused);
  };

  return (
    <div className={clsx(styles.inputRoot, rootClass)}>
      {fieldLabel && (
        <Typography className={clsx(styles.formLabel, { [styles.focused]: focused })}>
          {fieldLabel}
        </Typography>
      )}
      <PhoneInput
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
        onChange={onChange}
        value={value}
        containerClass={styles.reactTelInput}
        specialLabel={null}
        alwaysDefaultMask
        countryCodeEditable={false}
        country={country}
        placeholder={placeholder}
        inputClass={styles.easPhoneInput}
        isValid={isPhoneInputValid}
      />
    </div>
  )
};

export default EASPhoneInput;
