import React, { useState } from 'react';
import { Role } from "../../../../utils/constants";
import AccountSettings from '../AccountSettings';
import ApplicationSettings from '../ApplicationSettings';
import BracesSettings from '../BracesSettings';
import ClinicWorkingHours from '../ClinicWorkingHours';
import CompanyDetailsForm from '../CompanyDetailsForm';
import SecuritySettings from '../SecuritySettings';
import SettingsMenu from '../SettingsMenu';
import styles from './SettingsWrapper.module.scss';
import Integrations from "../Integrations";

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
  securitySettings: 'securitySettings',
  appSettings: 'appSettings',
  bracesSettings: 'bracesSettings',
  integrations: 'integrations',
};

const SettingsWrapper = ({ currentUser, currentClinic, countries }) => {
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
              countries={countries}
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
          {currentForm === SettingsForm.integrations && (
            <Integrations
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
        </div>
      </div>
  );
};

export default SettingsWrapper;
