import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import SwitchButton from 'app/components/common/SwitchButton';
import { textForKey } from 'app/utils/localization';
import { Doctor } from 'types';
import styles from './DoctorScheduleCreation.module.scss';

interface DoctorWithCanManage extends Doctor {
  canManageOwnSchedules: boolean;
}

interface Props extends Doctor {
  user: DoctorWithCanManage;
}

const DoctorScheduleCreation: React.FC<Props> = ({ user }) => {
  const [isChecked, setIsChecked] = useState(
    user?.canManageOwnSchedules ?? false,
  );

  const handleOnSwitchChange = () => {
    setIsChecked((prevState) => !prevState);
  };
  return (
    <div className={styles.wrapper}>
      <SwitchButton
        isChecked={isChecked}
        onChange={() => handleOnSwitchChange()}
      />
      <Typography className={styles.switchStatus}>
        {textForKey('can_manage_own_schedules')}
      </Typography>
    </div>
  );
};

export default DoctorScheduleCreation;
