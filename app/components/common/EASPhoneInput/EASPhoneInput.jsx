import React from "react";
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
  return (
    <div className={clsx(styles.inputRoot, rootClass)}>
      {fieldLabel && (
        <Typography className={styles.formLabel}>
          {fieldLabel}
        </Typography>
      )}
      <PhoneInput
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
