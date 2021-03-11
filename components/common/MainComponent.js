import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import styles from '../../styles/MainComponent.module.scss';

import { usePubNub } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';

import AddAppointmentModal from '../../src/components/AddAppintmentModal';
import DataMigrationModal from '../../src/components/DataMigrationModal';
import MainMenu from './MainMenu';
import PageHeader from './PageHeader';
import PatientDetailsModal from '../patients/PatientDetailsModal';
import ServiceDetailsModal from '../ServiceDetailsModal';
import {
  changeSelectedClinic,
  setAppointmentModal,
  setCreateClinic,
  setPatientDetails,
  toggleImportModal,
  triggerUserLogout,
} from '../../redux/actions/actions';
import { appointmentModalSelector } from '../../redux/selectors/modalsSelector';
import {
  isImportModalOpenSelector,
  patientDetailsSelector,
} from '../../redux/selectors/rootSelector';
import paths from '../../utils/paths';

const MainComponent = ({ children, currentPath, currentUser, currentClinic }) => {
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const appointmentModal = useSelector(appointmentModalSelector);
  const isImportModalOpen = useSelector(isImportModalOpenSelector);
  const patientDetails = useSelector(patientDetailsSelector);

  useEffect(() => {
    if (currentUser != null) {
      pubnub.setUUID(currentUser.id);
    }
  }, [currentUser]);

  const getPageTitle = () => {
    return paths[currentPath];
  };

  const handleStartLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  const handleCreateClinic = () => {
    dispatch(setCreateClinic({ open: true, canClose: true }));
  };

  const handleChangeCompany = company => {
    dispatch(changeSelectedClinic(company.clinicId));
  };

  const handleAppointmentModalClose = () => {
    dispatch(setAppointmentModal({ open: false }));
  };

  const handleClosePatientDetails = () => {
    dispatch(
      setPatientDetails({ show: false, patientId: null, onDelete: () => null }),
    );
  };

  const handleCloseImportModal = () => {
    dispatch(toggleImportModal());
  };

  return (
    <div className={styles['main-page']} id='main-page'>
      <ServiceDetailsModal currentClinic={currentClinic} />
      {patientDetails.patientId != null && (
        <PatientDetailsModal
          {...patientDetails}
          currentUser={currentUser}
          onClose={handleClosePatientDetails}
        />
      )}
      {isImportModalOpen && (
        <DataMigrationModal
          show={isImportModalOpen}
          onClose={handleCloseImportModal}
        />
      )}
      {appointmentModal?.open && (
        <AddAppointmentModal
          onClose={handleAppointmentModalClose}
          schedule={appointmentModal?.schedule}
          open={appointmentModal?.open}
          doctor={appointmentModal?.doctor}
          date={appointmentModal?.date}
          patient={appointmentModal?.patient}
          startHour={appointmentModal?.startHour}
          endHour={appointmentModal?.endHour}
        />
      )}
      {currentUser != null && currentClinic != null && (
        <MainMenu
          currentClinic={currentClinic}
          currentUser={currentUser}
          currentPath={currentPath}
          onCreateClinic={handleCreateClinic}
          onChangeCompany={handleChangeCompany}
        />
      )}
      {currentUser != null && (
        <div className={styles['data-container']}>
          <PageHeader
            title={getPageTitle()}
            user={currentUser}
            onLogout={handleStartLogout}
          />
          <div className={styles.data}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainComponent;

MainComponent.propTypes = {
  currentPath: PropTypes.string,
};

MainComponent.defaultProps = {
  currentPath: '/',
};
