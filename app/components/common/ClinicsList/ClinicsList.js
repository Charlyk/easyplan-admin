import React, { useEffect } from 'react';
import { Box, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { getClinicUrl } from "../../../../utils/helperFuncs";
import { textForKey } from "../../../../utils/localization";
import { isDev } from "../../../../eas.config";
import { triggerUserLogout } from "../../../../redux/actions/actions";
import { signOut } from "../../../../middleware/api/auth";
import ClinicItem from "./ClinicItem";
import styles from './ClnicsList.module.scss';

export default function ClinicsList({ user, authToken }) {
  const router = useRouter();
  const dispatch = useDispatch();

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
      <div className={styles.logoContainer}>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className={styles.formContainer}>
        <div className={styles.clinicsWrapper}>
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
