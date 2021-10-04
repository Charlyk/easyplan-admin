import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import IconSuccess from '../../../icons/iconSuccess';
import LoadingButton from '../../../common/LoadingButton';
import { textForKey } from '../../../../../utils/localization';
import { updateClinic } from "../../../../../middleware/api/clinic";
import styles from './ApplicationSettings.module.scss'
import EASTextField from "../../../common/EASTextField";

const ApplicationSettings = ({ currentClinic: clinic }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(String(clinic.timeBeforeOnSite));

  const handleFormChange = (newValue) => {
    setTime(newValue);
  };

  const isFormValid = () => {
    return time.length > 0;
  };

  const saveTimer = async () => {
    if (!isFormValid()) return;
    setIsLoading(true);
    try {
      const requestBody = {
        ...clinic,
        timeBeforeOnSite: parseInt(time),
      };
      await updateClinic(requestBody);
      router.replace(router.asPath);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.applicationSettingsForm}>
      <span className={styles.formTitle}>{textForKey('Application settings')}</span>
      <div className={styles.dataWrapper}>
        <EASTextField
          type="number"
          fieldLabel={textForKey('Animate appointments before')}
          value={time}
          helperText={textForKey('appointment_animation_timer')}
          onChange={handleFormChange}
        />
      </div>
      <div className={styles.footer}>
        <LoadingButton
          onClick={saveTimer}
          isLoading={isLoading}
          className={styles.saveButton}
          disabled={isLoading || !isFormValid()}
        >
          {textForKey('Save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default ApplicationSettings;
