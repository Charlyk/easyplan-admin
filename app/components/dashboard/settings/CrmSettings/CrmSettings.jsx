import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { textForKey } from 'app/utils/localization';
import CrmColumns from './CrmColumns';
import styles from './CrmSettings.module.scss';
import Integrations from './Integrations';

const CrmSettings = ({ currentUser, currentClinic }) => {
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
              label={textForKey('Integrations')}
              classes={{ root: styles.tabItem }}
            />
            <Tab
              value='1'
              label={textForKey('Columns')}
              classes={{ root: styles.tabItem }}
            />
          </TabList>
        </Box>
        <TabPanel value='0' style={{ padding: 0, width: '100%' }}>
          <Integrations currentClinic={currentClinic} />
        </TabPanel>
        <TabPanel value='1' style={{ padding: 0, width: '100%' }}>
          <CrmColumns currentUser={currentUser} currentClinic={currentClinic} />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default CrmSettings;
