import React from 'react';
import { getCurrentUser } from "../middleware/api/auth";
import { handleRequestError } from "../utils/helperFuncs";
import ClinicItem from "../components/login/ClinicItem";
import { Typography } from "@material-ui/core";
import { textForKey } from "../utils/localization";
import { useRouter } from "next/router";
import styles from '../styles/auth/ClnicsList.module.scss';
import { parseCookies } from "../utils";
import { isDev } from "../eas.config";

const Clinics = ({ user, authToken }) => {
  const router = useRouter();

  const handleClinicSelected = async (clinic) => {
    const { host, protocol } = window.location;
    const [_, domain, location] = host.split('.');
    const queryString = new URLSearchParams({
      token: authToken,
      clinicId: clinic.clinicId
    });
    await router.replace(`${protocol}//${clinic.clinicDomain}.${domain}.${location}/redirect?${queryString}`);
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
          {user.clinics.map(clinic => (
            <ClinicItem
              key={clinic.id}
              clinic={clinic}
              onSelected={handleClinicSelected}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token } = parseCookies(req);
    const response = await getCurrentUser(req.headers);
    return {
      props: {
        user: response.data,
        authToken: auth_token,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {}
    }
  }
}

export default Clinics;
