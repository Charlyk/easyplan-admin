import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Role } from "../../../../utils/constants";
import styles from './SettingsWrapper.module.scss';

const AccountSettings = dynamic(() => import('../AccountSettings'));
const ApplicationSettings = dynamic(() => import('../ApplicationSettings'));
const BracesSettings = dynamic(() => import('../BracesSettings'));
const ClinicWorkingHours = dynamic(() => import('../ClinicWorkingHours'));
const CompanyDetailsForm = dynamic(() => import('../CompanyDetailsForm'));
const SecuritySettings = dynamic(() => import('../SecuritySettings'));
const SettingsMenu = dynamic(() => import('../SettingsMenu'));
const CrmSettings = dynamic(() => import("../CrmSettings"));

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
  securitySettings: 'securitySettings',
  appSettings: 'appSettings',
  bracesSettings: 'bracesSettings',
  crmSettings: 'crmSettings',
};

const SettingsWrapper = ({ currentUser, currentClinic, countries, selectedMenu }) => {
  const selectedClinic = currentUser?.clinics.find(
    item => item.clinicId === currentClinic.id,
  );
  const [currentForm, setCurrentForm] = useState(
    [Role.admin, Role.manager].includes(selectedClinic?.roleInClinic)
      ? SettingsForm.companyDetails
      : SettingsForm.accountSettings,
  );

  useEffect(() => {
    if (!selectedMenu) {
      return;
    }
    setCurrentForm(selectedMenu);
  }, [selectedMenu]);

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
          {currentForm === SettingsForm.crmSettings && (
            <CrmSettings
              currentUser={currentUser}
              currentClinic={currentClinic}
            />
          )}
        </div>
      </div>
  );
};

export default SettingsWrapper;
