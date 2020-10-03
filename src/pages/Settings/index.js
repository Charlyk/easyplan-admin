import React, { useState } from 'react';

import SettingsMenu from './SettingsMenu';
import './styles.scss';
import CompanyDetailsForm from './CompanyDetailsForm';

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
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
      </div>
    </div>
  );
};

export default Settings;
