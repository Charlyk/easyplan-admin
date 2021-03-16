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
import ServiceDetailsModal from '../services/ServiceDetailsModal';
import {
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
import ExchangeRates from "./ExchangeRates";
import { isExchangeRateModalOpenSelector } from "../../redux/selectors/exchangeRatesModalSelector";
import { setIsExchangeRatesModalOpen } from "../../redux/actions/exchangeRatesActions";
import axios from "axios";
import { baseAppUrl } from "../../eas.config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Role } from "../../utils/constants";

const MainComponent = ({ children, currentPath, currentUser, currentClinic }) => {
  const pubnub = usePubNub();
  const router = useRouter();
  const dispatch = useDispatch();
  const appointmentModal = useSelector(appointmentModalSelector);
  const isImportModalOpen = useSelector(isImportModalOpenSelector);
  const patientDetails = useSelector(patientDetailsSelector);
  const isExchangeRatesModalOpen = useSelector(isExchangeRateModalOpenSelector);

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

  const handleChangeCompany = async (company) => {
    try {
      const query = { clinicId: company.clinicId };
      const queryString = new URLSearchParams(query).toString()
      const { data: selectedClinic } =
        await axios.get(`${baseAppUrl}/api/clinic/change?${queryString}`);
      switch (selectedClinic.roleInClinic) {
        case Role.reception:
          const isPathRestricted = ['/analytics', '/services', '/users', '/messages']
            .any(item => router.asPath.startsWith(item));
          if (isPathRestricted) {
            await router.replace('/patients');
          } else {
            await router.reload();
          }
          break;
        default:
          await router.reload();
          break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAppointmentModalClose = () => {
    dispatch(setAppointmentModal({ open: false }));
  };

  const handleClosePatientDetails = () => {
    dispatch(
      setPatientDetails({ show: false, patientId: null, onDelete: () => null }),
    );
  };

  const handleCloseExchangeRateModal = () => {
    dispatch(setIsExchangeRatesModalOpen(false));
  };

  const handleCloseImportModal = () => {
    dispatch(toggleImportModal());
  };

  return (
    <div className={styles['main-page']} id='main-page'>
      <ServiceDetailsModal currentClinic={currentClinic} />
      {isExchangeRatesModalOpen && (
        <ExchangeRates
          currentClinic={currentClinic}
          currentUser={currentUser}
          open={isExchangeRatesModalOpen}
          onClose={handleCloseExchangeRateModal}
        />
      )}
      {patientDetails.patientId != null && (
        <PatientDetailsModal
          {...patientDetails}
          currentClinic={currentClinic}
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
            currentClinic={currentClinic}
            title={getPageTitle()}
            user={currentUser}
            onLogout={handleStartLogout}
          />
          <div className={styles.data}>
            {currentClinic != null && children}
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
