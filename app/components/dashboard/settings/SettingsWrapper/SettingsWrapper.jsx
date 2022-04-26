import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userClinicSelector } from 'redux/selectors/appDataSelector';
import styles from './SettingsWrapper.module.scss';

const AccountSettings = dynamic(() =>
  import('../AccountSettings/AccountSettings'),
);
const ApplicationSettings = dynamic(() => import('../ApplicationSettings'));
const BracesSettings = dynamic(() => import('../BracesSettings'));
const ClinicWorkingHours = dynamic(() => import('../ClinicWorkingHours'));
const CompanyDetailsForm = dynamic(() => import('../CompanyDetailsForm'));
const SecuritySettings = dynamic(() => import('../SecuritySettings'));
const SettingsMenu = dynamic(() => import('../SettingsMenu'));
const CrmSettings = dynamic(() => import('../CrmSettings'));
const BillingDetails = dynamic(() => import('../BillingDetails'));

const SettingsForm = {
  companyDetails: 'company-details',
  workingHours: 'working-hours',
  accountSettings: 'account-settings',
  securitySettings: 'security-settings',
  appSettings: 'app-settings',
  bracesSettings: 'braces-settings',
  crmSettings: 'crm-settings',
  billingDetails: 'billing-details',
};

const SettingsWrapper = ({
  countries,
  selectedMenu,
  facebookToken,
  facebookCode,
}) => {
  const router = useRouter();
  const selectedClinic = useSelector(userClinicSelector);

  const handleFormChange = async (newForm) => {
    await router.replace(`/settings/${newForm}`);
  };

  return (
    <div className={styles['settings-root']}>
      <div className={styles['settings-root__menu']}>
        <SettingsMenu
          currentOption={selectedMenu}
          onSelect={handleFormChange}
          selectedClinic={selectedClinic}
        />
      </div>
      <div className={styles['settings-root__form']}>
        {selectedMenu === SettingsForm.companyDetails && (
          <CompanyDetailsForm countries={countries} />
        )}
        {selectedMenu === SettingsForm.workingHours && <ClinicWorkingHours />}
        {selectedMenu === SettingsForm.accountSettings && <AccountSettings />}
        {selectedMenu === SettingsForm.securitySettings && <SecuritySettings />}
        {selectedMenu === SettingsForm.appSettings && <ApplicationSettings />}
        {selectedMenu === SettingsForm.bracesSettings && <BracesSettings />}
        {selectedMenu === SettingsForm.billingDetails && <BillingDetails />}
        {selectedMenu === SettingsForm.crmSettings && (
          <CrmSettings
            facebookCode={facebookCode}
            facebookToken={facebookToken}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsWrapper;
