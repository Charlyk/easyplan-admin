import React, { useState } from "react";
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import TabList from "@material-ui/lab/TabList";
import Tab from "@material-ui/core/Tab";
import TabPanel from "@material-ui/lab/TabPanel";
import TabContext from "@material-ui/lab/TabContext";
import { textForKey } from "../../../../../utils/localization";
import AddNoteForm from "./AddNoteForm";
import AddReminderForm from "./AddReminderForm";
import styles from './FooterContainer.module.scss'
import { requestCreateDealNote, requestCreateDealReminder } from "../../../../../../middleware/api/crm";
import onRequestError from "../../../../../utils/onRequestError";
import moment from "moment-timezone";

const FooterContainer = ({ deal, currentClinic }) => {
  const [currentTab, setCurrentTab] = useState('0');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAddingReminder, setIsAddingReminder] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(`${newValue}`);
  };

  const handleNoteSubmit = async (note) => {
    console.log('note', note);
    try {
      setIsAddingNote(true);
      const response = await requestCreateDealNote(deal.id, note);
      console.log(response.data);
    } catch (error) {
      onRequestError(error)
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleReminderSubmit = async (reminder) => {
    try {
      setIsAddingReminder(true);
      const requestBody = {
        date: moment(reminder.date).format('YYYY-MM-DD'),
        startTime: reminder.startTime,
        endTime: reminder.endTime,
        userId: reminder.user.id,
        type: reminder.type.id,
        comment: reminder.noteText,
      }
      const response = await requestCreateDealReminder(deal.id, requestBody)
      console.log(response.data);
    } catch (error) {
      onRequestError(error)
    } finally {
      setIsAddingReminder(false);
    }
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
          <AddNoteForm
            onSubmit={handleNoteSubmit}
            isLoading={isAddingNote}
          />
        </TabPanel>
        <TabPanel value="1" style={{ padding: 0 }}>
          <AddReminderForm
            currentClinic={currentClinic}
            onSubmit={handleReminderSubmit}
            isLoading={isAddingReminder}
          />
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
