import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import SwitchButton from 'app/components/common/SwitchButton';
import styles from './ClinicSettings.module.scss';
import {
  dispatchFetchSettings,
  dispatchUpdateConfirmationDoctor,
} from './ClinicSettings.reducer';
import { clinicSettingsSelector } from './ClinicSettings.selector';

const ClinicSettings: React.FC = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const { settings } = useSelector(clinicSettingsSelector);

  useEffect(() => {
    dispatch(dispatchFetchSettings());
  }, []);

  const handleConfirmationChange = () => {
    dispatch(
      dispatchUpdateConfirmationDoctor(!settings.showDoctorOnConfirmation),
    );
  };

  return (
    <div className={styles.clinicSettings}>
      <div
        className={styles.confirmationDoctor}
        onClick={handleConfirmationChange}
        role='button'
        tabIndex={0}
      >
        <Typography className={styles.title}>
          {textForKey('show_doctor_on_confirmation')}
        </Typography>
        <SwitchButton
          clickable={false}
          isChecked={settings?.showDoctorOnConfirmation ?? false}
        />
      </div>
    </div>
  );
};

export default ClinicSettings;
