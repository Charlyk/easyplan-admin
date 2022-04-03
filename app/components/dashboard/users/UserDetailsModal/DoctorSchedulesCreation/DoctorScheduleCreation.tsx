import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useColor } from 'react-color-palette';
import { useDispatch } from 'react-redux';
import SwitchButton from 'app/components/common/SwitchButton';
import { textForKey } from 'app/utils/localization';
import {
  requestAllowDoctorCreateOthersSchedules,
  requestAllowDoctorCreateSchedules,
  requestForbidDoctorCreateOthersSchedules,
  requestForbidDoctorCreateSchedules,
  updateDoctorAppointmentsColor,
} from 'middleware/api/userPreferences';
import { UserClinic } from 'types';
import { fetchClinicUsers } from '../../../../../../redux/slices/usersListSlice';
import hexToHSV from '../../../../../utils/hexToHSV';
import hexToRGB from '../../../../../utils/hexToRGB';
import EASColorPicker from '../../../../common/EASColorPicker';
import styles from './DoctorScheduleCreation.module.scss';

interface Props {
  user: UserClinic;
}

const DoctorScheduleCreation: React.FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  const paletteRef = useRef(null);
  const [stateUser, setStateUser] = useState(user);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useColor('hex', '#3A83DC');

  useEffect(() => {
    setStateUser(user);
    if (user?.appointmentsColor != null) {
      setColor({
        hex: user.appointmentsColor,
        rgb: hexToRGB(user.appointmentsColor),
        hsv: hexToHSV(user.appointmentsColor),
      });
    }
  }, [user]);

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
    dispatch(fetchClinicUsers());
  };

  const handleOthersSwitchChange = async () => {
    let response;

    if (stateUser.canManageOthersAppointments) {
      response = await requestForbidDoctorCreateOthersSchedules(user.id);
    } else {
      response = await requestAllowDoctorCreateOthersSchedules(user.id);
    }

    setStateUser((prevState) => ({
      ...prevState,
      canManageOthersAppointments: response.data.canManageOthersAppointments,
    }));
    dispatch(fetchClinicUsers());
  };

  const handleShowPicker = (event) => {
    event.stopPropagation();
    setShowPicker(true);
  };

  const handleHidePicker = () => {
    setShowPicker(false);
  };

  const handleSaveColor = async (event) => {
    event.stopPropagation();
    if (user == null) {
      return;
    }
    try {
      await updateDoctorAppointmentsColor(user.id, color.hex);
      handleHidePicker();
    } catch (error) {
      console.error(error);
    }
  };

  const colorPickerPopper = (
    <EASColorPicker
      placement='top'
      open={showPicker}
      color={color}
      anchorEl={paletteRef.current}
      setColor={setColor}
      onClose={handleHidePicker}
      onSave={handleSaveColor}
    />
  );

  return (
    <div>
      <div className={styles.wrapper}>
        <SwitchButton
          isChecked={stateUser?.canCreateSchedules || false}
          onChange={handleOnSwitchChange}
        />
        <Typography className={styles.switchStatus}>
          {textForKey('can_manage_own_schedules')}
        </Typography>
      </div>
      <div className={styles.wrapper}>
        <SwitchButton
          isChecked={stateUser?.canManageOthersAppointments || false}
          onChange={handleOthersSwitchChange}
        />
        <Typography className={styles.switchStatus}>
          {textForKey('can_manage_others_schedules')}
        </Typography>
      </div>
      <div className={styles.wrapper} ref={paletteRef}>
        <Box
          width='40px'
          height='18px'
          display='flex'
          alignItems='center'
          justifyContent='center'
          onClick={handleShowPicker}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              borderRadius: '4px',
              backgroundColor: color.hex,
            }}
          />
        </Box>
        <Typography className={styles.switchStatus}>
          {textForKey('doctor_calendar_color')}
        </Typography>
      </div>
      {colorPickerPopper}
    </div>
  );
};

export default DoctorScheduleCreation;
