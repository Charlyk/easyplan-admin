import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import Box from "@material-ui/core/Box";
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { textForKey } from "../../../../utils/localization";
import EASModal from "../../common/modals/EASModal";
import ExistentPatientForm from "./ExistentPatientForm";
import NewPatientForm from "./NewPatientForm";
import styles from './LinkPatientModal.module.scss';

const LinkPatientModal = ({ open, contact, onClose }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <EASModal
      open={open}
      title={textForKey('link_patient')}
      className={styles.linkPatientModal}
      paperClass={styles.modalPaper}
      onClose={onClose}
    >
      <TabContext value={currentTab}>
        <Box>
          <TabList
            variant="fullWidth"
            classes={{
              root: styles.tabsRoot,
              indicator: styles.tabsIndicator
            }}
            onChange={handleTabChange}
          >
            <Tab
              label={textForKey('Existent patient')}
              classes={{ root: styles.tabItem }}
            />
            <Tab
              label={textForKey('New patient')}
              classes={{ root: styles.tabItem }}
            />
          </TabList>
        </Box>
        <TabPanel value={0} style={{ padding: 0 }}>
          <ExistentPatientForm />
        </TabPanel>
        <TabPanel value={1} style={{ padding: 0 }}>
          <NewPatientForm/>
        </TabPanel>
      </TabContext>
    </EASModal>
  )
};

export default LinkPatientModal;

LinkPatientModal.propTypes = {
  open: PropTypes.bool,
  contact: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    photoUrl: PropTypes.string
  }),
  onClose: PropTypes.func,
}
