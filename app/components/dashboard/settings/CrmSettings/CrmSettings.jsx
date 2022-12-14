import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { useTranslate } from 'react-polyglot';
import { useSelector } from 'react-redux';
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import CrmColumns from './CrmColumns';
import styles from './CrmSettings.module.scss';
import Integrations from './Integrations';

const CrmSettings = ({ facebookToken, facebookCode }) => {
  const textForKey = useTranslate();
  const currentUser = useSelector(currentUserSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const [currentTab, setCurrentTab] = useState('0');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(`${newValue}`);
  };
  return (
    <div className={styles.crmSettings}>
      <TabContext value={currentTab}>
        <Box>
          <TabList
            variant='fullWidth'
            classes={{
              root: styles.tabsRoot,
              indicator: styles.tabsIndicator,
            }}
            onChange={handleTabChange}
          >
            <Tab
              value='0'
              label={textForKey('integrations')}
              classes={{ root: styles.tabItem }}
            />
            <Tab
              value='1'
              label={textForKey('crm_columns')}
              classes={{ root: styles.tabItem }}
            />
          </TabList>
        </Box>
        <TabPanel value='0' style={{ padding: 0, width: '100%' }}>
          <Integrations
            currentClinic={currentClinic}
            facebookCode={facebookCode}
            facebookToken={facebookToken}
          />
        </TabPanel>
        <TabPanel value='1' style={{ padding: 0, width: '100%' }}>
          <CrmColumns currentUser={currentUser} currentClinic={currentClinic} />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default CrmSettings;
