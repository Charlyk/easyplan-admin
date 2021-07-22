import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputAdornment, OutlinedInput, Typography } from "@material-ui/core";

import { textForKey } from "../../../../../utils/localization";
import { valueToNumber } from "../../../../../utils/helperFuncs";
import EASModal from "../EASModal";
import styles from './DelayTimeModal.module.scss';

const DelayTimeModal = ({ open, initialTime, onSave, onClose}) => {
  const [value, setValue] = useState(initialTime);

  useEffect(() => {
    return () => {
      setValue(initialTime);
    }
  }, [])

  useEffect(() => {
    setValue(initialTime);
  }, [initialTime]);

  const handleValueChange = (event) => {
    const newValue = valueToNumber(event.target.value);
    setValue(`${newValue}`);
  }

  const handleSave = () => {
    onSave(parseInt(value, 10));
    onClose();
  }

  return (
    <EASModal
      open={open}
      bodyStyle={{ padding: 16 }}
      title={textForKey('delaytime')}
      onPrimaryClick={handleSave}
      onClose={onClose}
    >
      <Typography className={styles.fieldLabel}>
        {textForKey('How long the patient was late')}?
      </Typography>
      <FormControl variant="outlined" className={styles.formControl}>
        <OutlinedInput
          id="delay-time"
          type="number"
          className={styles.timeInput}
          value={value}
          onChange={handleValueChange}
          endAdornment={(
            <InputAdornment
              disableTypography
              classes={{
                root: styles.helperText
              }}
              position="end"
            >
              {textForKey('min')}
            </InputAdornment>
          )}
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            'aria-label': 'time',
          }}
          labelWidth={0}
        />
      </FormControl>
    </EASModal>
  )
};

export default DelayTimeModal;

DelayTimeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  initialTime: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
}

DelayTimeModal.defaultProps = {
  initialTime: '5',
  onSave: () => null,
}
