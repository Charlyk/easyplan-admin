import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { userSelector } from '../../redux/selectors/rootSelector';
import sessionManager from '../../utils/settings/sessionManager';
import AccountSettings from './AccountSettings';
import ApplicationSettings from './ApplicationSettings';
import BracesSettings from './BracesSettings';
import ClinicWorkingHours from './ClinicWorkingHours';
import CompanyDetailsForm from './CompanyDetailsForm';
import SecuritySettings from './SecuritySettings';
import SettingsMenu from './SettingsMenu';
import styles from './Settings.module.scss';

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
  securitySettings: 'securitySettings',
  appSettings: 'appSettings',
  bracesSettings: 'bracesSettings',
};

const Settings = () => {
  const currentUser = useSelector(userSelector);
  const selectedClinic = currentUser?.clinics.find(
    item => item.clinicId === sessionManager.getSelectedClinicId(),
  );
  const [currentForm, setCurrentForm] = useState(
    ['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic)
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
        {currentForm === SettingsForm.companyDetails && <CompanyDetailsForm />}
        {currentForm === SettingsForm.workingHours && <ClinicWorkingHours />}
        {currentForm === SettingsForm.accountSettings && <AccountSettings />}
        {currentForm === SettingsForm.securitySettings && <SecuritySettings />}
        {currentForm === SettingsForm.appSettings && <ApplicationSettings />}
        {currentForm === SettingsForm.bracesSettings && <BracesSettings />}
      </div>
    </div>
  );
};

export default Settings;
