import React, { useState } from "react";
import clsx from "clsx";
import PhoneInput from "react-phone-input-2";
import Typography from "@material-ui/core/Typography";
import isPhoneInputValid from "../../../utils/isPhoneInputValid";
import styles from './EASPhoneInput.module.scss';
import { textForKey } from "../../../utils/localization";

const EASPhoneInput = (
  {
    value,
    fieldLabel,
    country = 'md',
    placeholder = '079123456',
    helperText,
    rootClass,
    onChange
  }
) => {
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleFocusChange = (isFocused) => {
    setFocused(isFocused);
  };

  return (
    <div className={clsx(styles.inputRoot, rootClass)}>
      {fieldLabel && (
        <Typography
          className={clsx(
            styles.formLabel,
            {
              [styles.focused]: focused && isValid,
              [styles.error]: !isValid,
            }
          )}
        >
          {fieldLabel}
        </Typography>
      )}
      <PhoneInput
        alwaysDefaultMask
        onChange={onChange}
        value={value}
        containerClass={styles.reactTelInput}
        inputClass={styles.easPhoneInput}
        specialLabel={null}
        countryCodeEditable={false}
        country={country}
        placeholder={placeholder}
        isValid={(number, country) => {
          const isValid = isPhoneInputValid(number, country);
          setIsValid(isValid);
          return isValid;
        }}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
      />
      {(helperText || !isValid) && (
        <Typography
          className={clsx(
            styles.helperText,
            {
              [styles.error]: !isValid
            }
          )}
        >
          {isValid ? helperText : textForKey('phone_invalid_message')}
        </Typography>
      )}
    </div>
  )
};

export default EASPhoneInput;
