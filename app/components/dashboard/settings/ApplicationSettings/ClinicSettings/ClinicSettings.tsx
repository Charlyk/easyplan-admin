import React, { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import SwitchButton from 'app/components/common/SwitchButton';
import { textForKey } from 'app/utils/localization';
import styles from './ClinicSettings.module.scss';
import {
  dispatchFetchSettings,
  dispatchUpdateConfirmationDoctor,
} from './ClinicSettings.reducer';
import { clinicSettingsSelector } from './ClinicSettings.selector';

const ClinicSettings: React.FC = () => {
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
      <Box
        className={styles.confirmationDoctor}
        onClick={handleConfirmationChange}
      >
        <Typography className={styles.title}>
          {textForKey('show_doctor_on_confirmation')}
        </Typography>
        <SwitchButton
          clickable={false}
          isChecked={settings?.showDoctorOnConfirmation ?? false}
        />
      </Box>
    </div>
  );
};

export default ClinicSettings;
