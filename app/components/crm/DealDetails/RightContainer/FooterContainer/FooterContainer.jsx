import React, { useMemo, useState } from "react";
import PropTypes from 'prop-types';
import styles from './FooterContainer.module.scss'
import AddNoteForm from "./AddNoteForm";
import Box from "@material-ui/core/Box";
import TabList from "@material-ui/lab/TabList";
import Tab from "@material-ui/core/Tab";
import { textForKey } from "../../../../../utils/localization";
import TabPanel from "@material-ui/lab/TabPanel";
import TabContext from "@material-ui/lab/TabContext";
import AddReminderForm from "./AddReminderForm";

const FooterContainer = ({ deal, currentClinic }) => {
  const [currentTab, setCurrentTab] = useState('0');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(`${newValue}`);
  };

  return (
    <div className={styles.footerContainer}>
      <TabContext value={currentTab}>
        <Box>
          <TabList
            classes={{
              root: styles.tabsRoot,
              indicator: styles.tabsIndicator
            }}
            onChange={handleTabChange}
          >
            <Tab
              value="0"
              label={textForKey('crm_new_note')}
              classes={{ root: styles.tabItem }}
            />
            <Tab
              value="1"
              label={textForKey('crm_new_reminder')}
              classes={{ root: styles.tabItem }}
            />
          </TabList>
        </Box>
        <TabPanel value="0" style={{ padding: 0 }}>
          <AddNoteForm/>
        </TabPanel>
        <TabPanel value="1" style={{ padding: 0 }}>
          <AddReminderForm currentClinic={currentClinic} />
        </TabPanel>
      </TabContext>
    </div>
  )
};

export default FooterContainer;

FooterContainer.propTypes = {
  currentClinic: PropTypes.any,
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
    }),
    state: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      orderId: PropTypes.number,
      deleteable: PropTypes.bool,
      type: PropTypes.string,
    }),
    assignedTo: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      currency: PropTypes.string,
    }),
    schedule: PropTypes.shape({
      id: PropTypes.number,
      created: PropTypes.string,
      dateAndTime: PropTypes.string,
      endTime: PropTypes.string,
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
}
