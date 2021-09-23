import React, { useEffect } from 'react';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import getClinicUrl from "../../../../utils/getClinicUrl";
import { textForKey } from "../../../../utils/localization";
import { isDev } from "../../../../eas.config";
import { triggerUserLogout } from "../../../../redux/actions/actions";
import { signOut } from "../../../../middleware/api/auth";
import ClinicItem from "./ClinicItem";
import styles from './ClnicsList.module.scss';
import useIsMobileDevice from "../../../utils/useIsMobileDevice";

export default function ClinicsList({ user, authToken }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobileDevice = useIsMobileDevice();

  useEffect(() => {
    if (user?.clinics.length === 1) {
      handleClinicSelected(user.clinics[0]);
    } else if (user?.clinics.length === 0) {
      router.replace('/create-clinic');
    }
  }, [user]);

  const handleClinicSelected = async (clinic) => {
    await signOut()
    const clinicUrl = getClinicUrl(clinic, authToken);
    await router.replace(clinicUrl);
  }

  const handleLogout = () => {
    dispatch(triggerUserLogout(true));
  }

  return (
    <div className={styles.clinicsListRoot}>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {!isMobileDevice && (
        <div className={styles.logoContainer}>
          <img
            src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
            alt='EasyPlan'
          />
        </div>
      )}
      <div
        className={styles.formContainer}
        style={{
          width: isMobileDevice ? '100%' : '60%',
          backgroundColor: isMobileDevice ? '#34344E' : '#E5E5E5',
        }}
      >
        {isMobileDevice && (
          <img
            src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
            alt='EasyPlan'
          />
        )}
        <div
          className={styles.clinicsWrapper}
          style={{
            padding: isMobileDevice ? '2rem' : '3rem',
            width: isMobileDevice ? '90%' : '70%',
          }}
        >
          <Typography className={styles.formTitle}>
            {textForKey('Select a clinic')}
          </Typography>
          {user?.clinics?.map(clinic => (
            <ClinicItem
              key={clinic.id}
              clinic={clinic}
              onSelected={handleClinicSelected}
            />
          ))}
          <Box display='flex' width='100%' alignItems='center' mt='1rem'>
            <Button className='positive-button' onClick={handleLogout}>
              {textForKey('Logout')}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};
