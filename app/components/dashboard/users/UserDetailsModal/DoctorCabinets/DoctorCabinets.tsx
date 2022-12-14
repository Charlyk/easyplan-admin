import React, { useEffect, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Link from 'next/link';
import { useTranslate } from 'react-polyglot';
import { useDispatch } from 'react-redux';
import NotificationsContext from 'app/context/notificationsContext';
import { useSelector } from 'app/hooks/useTypedSelector';
import onRequestFailed from 'app/utils/onRequestFailed';
import {
  getAllCabinetsInfo,
  addDoctor,
  deleteDoctor,
} from 'middleware/api/cabinets';
import { cabinetsSelector } from 'redux/selectors/cabinetSelector';
import { setCabinets, updateCabinet } from 'redux/slices/cabinetsData';
import { ClinicCabinet, Doctor } from 'types';
import styles from './DoctorCabinets.module.scss';

interface Props {
  clinicCabinets: ClinicCabinet[];
  user: Doctor;
}

const DoctorCabinets: React.FC<Props> = ({ user }) => {
  const textForKey = useTranslate();
  const clinicCabinets = useSelector(cabinetsSelector);
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const fetchData = async () => {
    try {
      const { data } = await getAllCabinetsInfo();
      return data;
    } catch (err) {
      onRequestFailed(err, toast);
    }
  };

  useEffect(() => {
    fetchData().then((data) => dispatch(setCabinets(data)));
  }, []);

  const handleOnCheckboxChange = async (
    doctorId: number,
    cabinetId: number,
    isChecked: boolean,
  ): Promise<void> => {
    try {
      const params = {
        id: [doctorId],
        cabinet: cabinetId,
      };

      if (isChecked) {
        const { data } = await deleteDoctor(params);
        dispatch(updateCabinet(data));
      } else {
        const { data } = await addDoctor(params);
        dispatch(updateCabinet(data));
      }
    } catch (err) {
      onRequestFailed(err, toast);
    }
  };

  return (
    <div className={styles.wrapper}>
      {clinicCabinets.length ? (
        clinicCabinets.map((cabinet) => {
          const isCabinetChecked = cabinet.users.some(
            (cabinetUser) => cabinetUser.user.id === user.id,
          );
          return (
            <Box key={cabinet.id} display='flex' alignItems='center'>
              <Checkbox
                checked={isCabinetChecked}
                className={styles.serviceCheckBox}
                onChange={() =>
                  handleOnCheckboxChange(user.id, cabinet.id, isCabinetChecked)
                }
              />
              <Typography className={styles.cabinetName}>
                {cabinet.name}
              </Typography>
            </Box>
          );
        })
      ) : (
        <div className={styles.cabinetEmpty}>
          <Typography className={styles.cabinetEmptyText}>
            {`${textForKey('no results')} ...`}
          </Typography>
          <Link href='/settings/app-settings'>
            <a className={styles.cabinetEmptyLink}>
              {textForKey('add_cabinet')}
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DoctorCabinets;
