import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { Role } from 'app/utils/constants';
import {
  currentClinicSelector,
  currentUserSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import styles from './SettingsWrapper.module.scss';
const AccountSettings = dynamic(() => import('../AccountSettings'));
const ApplicationSettings = dynamic(() => import('../ApplicationSettings'));
const BracesSettings = dynamic(() => import('../BracesSettings'));
const ClinicWorkingHours = dynamic(() => import('../ClinicWorkingHours'));
const CompanyDetailsForm = dynamic(() => import('../CompanyDetailsForm'));
const SecuritySettings = dynamic(() => import('../SecuritySettings'));
const SettingsMenu = dynamic(() => import('../SettingsMenu'));
const CrmSettings = dynamic(() => import('../CrmSettings'));

const SettingsForm = {
  companyDetails: 'companyDetails',
  workingHours: 'workingHours',
  accountSettings: 'accountSettings',
  securitySettings: 'securitySettings',
  appSettings: 'appSettings',
  bracesSettings: 'bracesSettings',
  crmSettings: 'crmSettings',
};

const SettingsWrapper = ({ countries, selectedMenu }) => {
  const currentUser = useSelector(currentUserSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const selectedClinic = useSelector(userClinicSelector);
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

  const handleFormChange = (newForm) => setCurrentForm(newForm);

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
          <CompanyDetailsForm countries={countries} />
        )}
        {currentForm === SettingsForm.workingHours && <ClinicWorkingHours />}
        {currentForm === SettingsForm.accountSettings && <AccountSettings />}
        {currentForm === SettingsForm.securitySettings && <SecuritySettings />}
        {currentForm === SettingsForm.appSettings && <ApplicationSettings />}
        {currentForm === SettingsForm.bracesSettings && <BracesSettings />}
        {currentForm === SettingsForm.crmSettings && <CrmSettings />}
      </div>
    </div>
  );
};

export default SettingsWrapper;
