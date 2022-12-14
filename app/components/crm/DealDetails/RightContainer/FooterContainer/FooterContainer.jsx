import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import { requestCreateDealNote } from 'middleware/api/crm';
import { requestSendSms } from 'middleware/api/patients';
import { dealDetailsSelector } from 'redux/selectors/crmBoardSelector';
import AddNoteForm from './AddNoteForm';
import AddSmsForm from './AddSmsForm/AddSmsForm';
import styles from './FooterContainer.module.scss';

const FooterContainer = ({ onAddReminder }) => {
  const { deal } = useSelector(dealDetailsSelector);
  const [currentTab, setCurrentTab] = useState('0');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAddingSms, setIsAddingSms] = useState(false);

  const handleTabChange = (event, newValue) => {
    if (newValue === '3') {
      onAddReminder?.(deal);
      return;
    }
    setCurrentTab(`${newValue}`);
  };

  const handleNoteSubmit = async (note) => {
    try {
      setIsAddingNote(true);
      await requestCreateDealNote(deal.id, note);
    } catch (error) {
      onRequestError(error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleSmsSubmit = async (message) => {
    if (deal?.patient == null) {
      return;
    }
    try {
      setIsAddingSms(true);
      await requestSendSms(message, deal.patient.id, deal.id);
    } catch (error) {
      onRequestError(error);
    } finally {
      setIsAddingSms(false);
    }
  };

  return (
    <div className={styles.footerContainer}>
      <TabContext value={currentTab}>
        <Box>
          <TabList
            classes={{
              root: styles.tabsRoot,
              indicator: styles.tabsIndicator,
            }}
            onChange={handleTabChange}
          >
            <Tab
              value='0'
              label={textForKey('crm_new_note')}
              classes={{ root: styles.tabItem }}
            />
            <Tab
              value='1'
              label={`${textForKey('send message')} SMS`}
              classes={{ root: styles.tabItem }}
            />
            <Tab
              value='3'
              label={textForKey('crm_add_reminder')}
              classes={{ root: styles.tabItem }}
            />
          </TabList>
        </Box>
        <TabPanel value='0' style={{ padding: 0 }}>
          <AddNoteForm onSubmit={handleNoteSubmit} isLoading={isAddingNote} />
        </TabPanel>
        {deal?.patient ? (
          <TabPanel value='1' style={{ padding: 0 }}>
            <AddSmsForm isLoading={isAddingSms} onSubmit={handleSmsSubmit} />
          </TabPanel>
        ) : null}
      </TabContext>
    </div>
  );
};

export default FooterContainer;

FooterContainer.propTypes = {
  currentClinic: PropTypes.any,
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string,
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
      created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dateAndTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  onAddReminder: PropTypes.func,
};
