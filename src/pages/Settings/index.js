import React, { useState } from 'react';

import SettingsMenu from './SettingsMenu';
import './styles.scss';
import CompanyDetailsForm from './CompanyDetailsForm';
import ClinicWorkingHours from './ClinicWorkingHours';
import AccountSettings from './AccountSettings';

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
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
      </div>
    </div>
  );
};

export default Settings;
