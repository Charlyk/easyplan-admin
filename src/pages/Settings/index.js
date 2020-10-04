import React, { useState } from 'react';

import SettingsMenu from './SettingsMenu';
import './styles.scss';
import AccountSettings from './AccountSettings';
import ClinicWorkingHours from './ClinicWorkingHours';
import CompanyDetailsForm from './CompanyDetailsForm';
import SecuritySettings from './SecuritySettings';

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
  securitySettings: 'securitySettings',
};

const Settings = props => {
  const [currentForm, setCurrentForm] = useState(SettingsForm.companyDetails);

  const handleFormChange = newForm => setCurrentForm(newForm);

  return (
    <div className='settings-root'>
      <div className='settings-root__menu'>
        <SettingsMenu currentOption={currentForm} onSelect={handleFormChange} />
      </div>
      <div className='settings-root__form'>
        {currentForm === SettingsForm.companyDetails && <CompanyDetailsForm />}
        {currentForm === SettingsForm.workingHours && <ClinicWorkingHours />}
        {currentForm === SettingsForm.accountSettings && <AccountSettings />}
        {currentForm === SettingsForm.securitySettings && <SecuritySettings />}
      </div>
    </div>
  );
};

export default Settings;
