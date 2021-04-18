import React, { useState } from 'react';

import AccountSettings from '../../components/settings/AccountSettings';
import ApplicationSettings from '../../components/settings/ApplicationSettings';
import BracesSettings from '../../components/settings/BracesSettings';
import ClinicWorkingHours from '../../components/settings/ClinicWorkingHours';
import CompanyDetailsForm from '../../components/settings/CompanyDetailsForm';
import SecuritySettings from '../../components/settings/SecuritySettings';
import SettingsMenu from '../../components/settings/SettingsMenu';
import styles from '../../styles/Settings.module.scss';
import MainComponent from "../../components/common/MainComponent";
import { Role } from "../../app/utils/constants";
import { fetchAppData } from "../../middleware/api/initialization";
import { handleRequestError, redirectToUrl, redirectUserTo } from "../../utils/helperFuncs";
import { parseCookies } from "../../utils";

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
  securitySettings: 'securitySettings',
  appSettings: 'appSettings',
  bracesSettings: 'bracesSettings',
};

const Settings = ({ currentUser, currentClinic, authToken }) => {
  const selectedClinic = currentUser?.clinics.find(
    item => item.clinicId === currentClinic.id,
  );
  const [currentForm, setCurrentForm] = useState(
    [Role.admin, Role.manager].includes(selectedClinic?.roleInClinic)
      ? SettingsForm.companyDetails
      : SettingsForm.accountSettings,
  );

  const handleFormChange = newForm => setCurrentForm(newForm);

  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/settings'
      authToken={authToken}
    >
      <div className={styles['settings-root']}>
        <div className={styles['settings-root__menu']}>
          <SettingsMenu
            currentOption={currentForm}
            onSelect={handleFormChange}
            selectedClinic={selectedClinic}
          />
        </div>
        <div className={styles['settings-root__form']}>
          {currentForm === SettingsForm.companyDetails && (
            <CompanyDetailsForm
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
          {currentForm === SettingsForm.workingHours && (
            <ClinicWorkingHours
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
          {currentForm === SettingsForm.accountSettings && (
            <AccountSettings
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
          {currentForm === SettingsForm.securitySettings && (
            <SecuritySettings
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
          {currentForm === SettingsForm.appSettings && (
            <ApplicationSettings
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
          {currentForm === SettingsForm.bracesSettings && (
            <BracesSettings
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
        </div>
      </div>
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/settings');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return {
        props: {
          ...appData,
          authToken,
        }
      };
    }

    return {
      props: {
        ...appData,
        authToken,
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {}
    }
  }
}

export default Settings;
