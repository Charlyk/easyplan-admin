import React from 'react';
import EASTextField from 'app/components/common/EASTextField';
import { textForKey } from 'app/utils/localization';
import styles from './TimeBeforeOnSite.module.scss';

const TimeBeforeOnSite = ({ value, onChange }) => {
  const handleFormChange = (newValue) => {
    onChange?.(newValue);
  };

  return (
    <EASTextField
      type='number'
      containerClass={styles.timeBeforeOnSite}
      fieldLabel={textForKey('Animate appointments before')}
      value={value}
      helperText={textForKey('appointment_animation_timer')}
      onChange={handleFormChange}
    />
  );
};

export default TimeBeforeOnSite;
