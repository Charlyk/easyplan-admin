import React from 'react';
import { useTranslate } from 'react-polyglot';
import EASTextField from 'app/components/common/EASTextField';
import styles from './TimeBeforeOnSite.module.scss';

const TimeBeforeOnSite = ({ value, onChange }) => {
  const textForKey = useTranslate();
  const handleFormChange = (newValue) => {
    if (Number(newValue) > 120) {
      onChange?.(120);
    } else {
      onChange?.(newValue);
    }
  };

  return (
    <EASTextField
      type='number'
      containerClass={styles.timeBeforeOnSite}
      fieldLabel={textForKey('animate appointments before')}
      value={value}
      max={120}
      helperText={textForKey('appointment_animation_timer')}
      onChange={handleFormChange}
    />
  );
};

export default TimeBeforeOnSite;
