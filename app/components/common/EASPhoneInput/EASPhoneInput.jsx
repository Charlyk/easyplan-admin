import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import { useTranslate } from 'react-polyglot';
import isPhoneInputValid from 'app/utils/isPhoneInputValid';
import styles from './EASPhoneInput.module.scss';

const EASPhoneInput = ({
  value,
  fieldLabel,
  country = 'md',
  placeholder = '079123456',
  helperText,
  rootClass,
  onChange,
}) => {
  const textForKey = useTranslate();
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleFocusChange = (isFocused) => {
    setFocused(isFocused);
  };

  return (
    <div className={clsx(styles.inputRoot, rootClass)}>
      {fieldLabel && (
        <Typography
          className={clsx(styles.formLabel, {
            [styles.focused]: focused && isValid,
            [styles.error]: !isValid,
          })}
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
          className={clsx(styles.helperText, {
            [styles.error]: !isValid,
          })}
        >
          {isValid ? helperText : textForKey('phone_invalid_message')}
        </Typography>
      )}
    </div>
  );
};

export default EASPhoneInput;

EASPhoneInput.propTypes = {
  value: PropTypes.any,
  fieldLabel: PropTypes.any,
  country: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  rootClass: PropTypes.any,
  onChange: PropTypes.func,
};

EASPhoneInput.defaultProps = {
  value: null,
  fieldLabel: null,
  country: 'md',
  placeholder: null,
  helperText: null,
  rootClass: null,
  onChange: () => null,
};
