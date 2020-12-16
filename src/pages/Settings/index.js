import React, { useState } from 'react';

import SettingsMenu from './SettingsMenu';

import './styles.scss';
import { useSelector } from 'react-redux';

import { userSelector } from '../../redux/selectors/rootSelector';
import AccountSettings from './AccountSettings';
import ApplicationSettings from './ApplicationSettings';
import BracesSettings from './BracesSettings';
import ClinicWorkingHours from './ClinicWorkingHours';
import CompanyDetailsForm from './CompanyDetailsForm';
import SecuritySettings from './SecuritySettings';

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
  securitySettings: 'securitySettings',
  appSettings: 'appSettings',
  bracesSettings: 'bracesSettings',
};

const Settings = props => {
  const currentUser = useSelector(userSelector);
  const selectedClinic = currentUser?.clinics.find(
    item => item.clinicId === currentUser?.selectedClinic.id,
  );
  const [currentForm, setCurrentForm] = useState(
    ['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic)
      ? SettingsForm.companyDetails
      : SettingsForm.accountSettings,
  );

  const handleFormChange = newForm => setCurrentForm(newForm);

  return (
    <div className='settings-root'>
      <div className='settings-root__menu'>
        <SettingsMenu
          currentOption={currentForm}
          onSelect={handleFormChange}
          selectedClinic={selectedClinic}
        />
      </div>
      <div className='settings-root__form'>
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
