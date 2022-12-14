import React, { useContext, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from 'app/components/common/LoadingButton';
import ClinicsModal from 'app/components/common/modals/ClinicsModal';
import IconSuccess from 'app/components/icons/iconSuccess';
import NotificationsContext from 'app/context/notificationsContext';
import { HeaderKeys } from 'app/utils/constants';
import onRequestError from 'app/utils/onRequestError';
import { updateClinic } from 'middleware/api/clinic';
import { requestShareTags } from 'middleware/api/tags';
import {
  authTokenSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import { setCurrentClinic } from 'redux/slices/appDataSlice';
import styles from './ApplicationSettings.module.scss';
import ClinicCabinets from './CliniCabinets';
import ClinicSettings from './ClinicSettings';
import ClinicTags from './ClinicTags';
import ConsultationService from './ConsultationService';
import TimeBeforeOnSite from './TimeBeforeOnSite';

const ApplicationSettings = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const clinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const toast = useContext(NotificationsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(String(clinic.timeBeforeOnSite));
  const [clinicsModal, setClinicsModal] = useState({ open: false, tags: [] });

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
      const response = await updateClinic(requestBody, null, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinic.id,
        [HeaderKeys.subdomain]: clinic.domainName,
      });
      dispatch(setCurrentClinic(response.data));
      toast.success(textForKey('saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareTags = (tags) => {
    setClinicsModal({ open: true, tags });
  };

  const handleCloseClinics = () => {
    setClinicsModal({ open: false, tags: [] });
  };

  const handleClinicSelected = async (clinic) => {
    const tags = clinicsModal.tags;
    handleCloseClinics();
    try {
      await requestShareTags(clinic.id, tags);
      toast.success(textForKey('share_tags_success', clinic.clinicName));
    } catch (error) {
      onRequestError(error);
    }
  };

  return (
    <div className={styles.applicationSettingsForm}>
      <ClinicsModal
        open={clinicsModal.open}
        currentClinicId={clinic.id}
        onSelect={handleClinicSelected}
        onClose={handleCloseClinics}
      />
      <span className={styles.formTitle}>
        {textForKey('application settings')}
      </span>
      <div className={styles.dataWrapper}>
        <Typography className={styles.titleLabel}>
          {textForKey('app_settings_time_before_on_site')}
        </Typography>
        <TimeBeforeOnSite value={time} onChange={handleFormChange} />
        <Divider className={styles.divider} />
        <Typography className={styles.titleLabel}>
          {textForKey('consultation_service')}
        </Typography>
        <ConsultationService />
        <Divider className={styles.divider} />
        <Typography className={styles.titleLabel}>
          {textForKey('app_settings_tags')}
        </Typography>
        <ClinicTags onShare={handleShareTags} />
        <Divider className={styles.divider} />
        <Typography className={styles.titleLabel}>
          {textForKey('clinic_cabinets')}
        </Typography>
        <ClinicCabinets />
        <Divider className={styles.divider} />
        <Typography className={styles.titleLabel}>
          {textForKey('clinic_settings')}
        </Typography>
        <ClinicSettings />
      </div>
      <div className={styles.footer}>
        <LoadingButton
          onClick={saveTimer}
          isLoading={isLoading}
          className={styles.saveButton}
          disabled={
            isLoading ||
            !isFormValid() ||
            time === String(clinic.timeBeforeOnSite)
          }
        >
          {textForKey('save')}
          <IconSuccess />
        </LoadingButton>
      </div>
    </div>
  );
};

export default ApplicationSettings;
