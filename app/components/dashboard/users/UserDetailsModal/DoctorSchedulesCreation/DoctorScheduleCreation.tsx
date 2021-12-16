import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import SwitchButton from 'app/components/common/SwitchButton';
import { textForKey } from 'app/utils/localization';
import {
  requestAllowDoctorCreateSchedules,
  requestForbidDoctorCreateSchedules,
} from 'middleware/api/userPreferences';
import { UserClinic } from 'types';

import styles from './DoctorScheduleCreation.module.scss';

interface Props {
  user: UserClinic;
}

const DoctorScheduleCreation: React.FC<Props> = ({ user }) => {
  const [stateUser, setStateUser] = useState(user);

  const handleOnSwitchChange = async () => {
    let response;

    if (stateUser.canCreateSchedules) {
      response = await requestForbidDoctorCreateSchedules(user.id);
    } else {
      response = await requestAllowDoctorCreateSchedules(user.id);
    }

    setStateUser((prevState) => ({
      ...prevState,
      canCreateSchedules: response.data.canCreateSchedules,
    }));
  };
  return (
    <div className={styles.wrapper}>
      <SwitchButton
        isChecked={stateUser?.canCreateSchedules || false}
        onChange={() => handleOnSwitchChange()}
      />
      <Typography className={styles.switchStatus}>
        {textForKey('can_manage_own_schedules')}
      </Typography>
    </div>
  );
};

export default DoctorScheduleCreation;
