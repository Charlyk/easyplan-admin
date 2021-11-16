import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import IconSuccess from '../../../icons/iconSuccess';
import LoadingButton from '../../../common/LoadingButton';
import { textForKey } from '../../../../utils/localization';
import { updateClinic } from "../../../../../middleware/api/clinic";
import styles from './ApplicationSettings.module.scss'
import EASTextField from "../../../common/EASTextField";
import { HeaderKeys } from "../../../../utils/constants";
import TimeBeforeOnSite from "./TimeBeforeOnSite";
import ClinicTags from "./ClinicTags";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const ApplicationSettings = ({ currentClinic: clinic, authToken }) => {
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
      await updateClinic(requestBody, null, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinic.id,
        [HeaderKeys.subdomain]: clinic.domainName,
      });
      await router.replace(router.asPath);
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
        <Typography className={styles.titleLabel}>
          {textForKey('app_settings_time_before_on_site')}
        </Typography>
        <TimeBeforeOnSite
          value={time}
          onChange={handleFormChange}
        />
        <Divider className={styles.divider}/>
        <Typography className={styles.titleLabel}>
          {textForKey('app_settings_tags')}
        </Typography>
        <ClinicTags />
        <Divider className={styles.divider}/>
      </div>
      <div className={styles.footer}>
        <LoadingButton
          onClick={saveTimer}
          isLoading={isLoading}
          className={styles.saveButton}
          disabled={isLoading || !isFormValid() || time === String(clinic.timeBeforeOnSite)}
        >
          {textForKey('Save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default ApplicationSettings;
