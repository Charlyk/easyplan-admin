import React, { useEffect, useReducer } from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import PropTypes from 'prop-types';
import EASModal from 'app/components/common/modals/EASModal';
import { textForKey } from 'app/utils/localization';
import { requestLinkPatient } from 'middleware/api/crm';
import onRequestError from 'app/utils/onRequestError';
import ExistentPatientForm from './ExistentPatientForm';
import styles from './LinkPatientModal.module.scss';
import reducer, {
  initialState,
  setPatientData,
  setCurrentTab,
  setIsLoading,
  resetState,
} from './LinkPatientModal.reducer';
import NewPatientForm from './NewPatientForm';

const LinkPatientModal = ({ open, deal, confirm, onClose, onLinked }) => {
  const [{ currentTab, patientData, isLoading }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (!open) {
      localDispatch(resetState());
    }
  }, [open]);

  const handleTabChange = (event, newValue) => {
    localDispatch(setCurrentTab(`${newValue}`));
  };

  const handlePatientChange = (patientData) => {
    localDispatch(setPatientData(patientData));
  };

  const handleSubmitPatient = async () => {
    try {
      localDispatch(setIsLoading(true));
      const response = await requestLinkPatient(deal.id, patientData);
      onLinked?.(response.data, confirm);
      onClose?.();
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  return (
    <EASModal
      open={open}
      title={textForKey('link_patient')}
      className={styles.linkPatientModal}
      paperClass={styles.modalPaper}
      onPrimaryClick={handleSubmitPatient}
      isPositiveDisabled={patientData == null}
      isPositiveLoading={isLoading}
      onClose={onClose}
    >
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
              label={textForKey('Existent patient')}
              classes={{ root: styles.tabItem }}
            />
            <Tab
              value='1'
              label={textForKey('New patient')}
              classes={{ root: styles.tabItem }}
            />
          </TabList>
        </Box>
        <TabPanel value='0' style={{ padding: 0 }}>
          <ExistentPatientForm deal={deal} onChange={handlePatientChange} />
        </TabPanel>
        <TabPanel value='1' style={{ padding: 0 }}>
          <NewPatientForm deal={deal} onChange={handlePatientChange} />
        </TabPanel>
      </TabContext>
    </EASModal>
  );
};

export default LinkPatientModal;

LinkPatientModal.propTypes = {
  open: PropTypes.bool,
  confirm: PropTypes.bool,
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
    patient: PropTypes.any,
  }),
  onClose: PropTypes.func,
  onLinked: PropTypes.func,
};
