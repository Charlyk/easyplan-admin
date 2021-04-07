import React, { useEffect, useMemo } from 'react';

import PropTypes from 'prop-types';
import styles from '../../styles/MainComponent.module.scss';

import { usePubNub } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';

import AddAppointmentModal from '../calendar/AddAppintmentModal';
import DataMigrationModal from './DataMigrationModal';
import MainMenu from './MainMenu';
import PageHeader from './PageHeader';
import PatientDetailsModal from '../patients/PatientDetailsModal';
import ServiceDetailsModal from '../services/ServiceDetailsModal';
import {
  setAppointmentModal,
  setCreateClinic,
  setPatientDetails, setPaymentModal,
  toggleImportModal,
  triggerUserLogout,
} from '../../redux/actions/actions';
import { appointmentModalSelector, paymentModalSelector } from '../../redux/selectors/modalsSelector';
import {
  isImportModalOpenSelector,
  patientDetailsSelector,
} from '../../redux/selectors/rootSelector';
import paths from '../../utils/paths';
import ExchangeRates from "./ExchangeRates";
import { isExchangeRateModalOpenSelector } from "../../redux/selectors/exchangeRatesModalSelector";
import { setIsExchangeRatesModalOpen } from "../../redux/actions/exchangeRatesActions";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Role } from "../../utils/constants";
import { handleRemoteMessage } from "../../utils/pubnubUtils";
import { changeCurrentClinic } from "../../middleware/api/clinic";
import CheckoutModal from "../invoices/CheckoutModal";
import { setClinic } from "../../redux/actions/clinicActions";

const MainComponent = ({ children, currentPath, currentUser, currentClinic, authToken }) => {
  const pubnub = usePubNub();
  const router = useRouter();
  const dispatch = useDispatch();
  const appointmentModal = useSelector(appointmentModalSelector);
  const paymentModal = useSelector(paymentModalSelector);
  const isImportModalOpen = useSelector(isImportModalOpenSelector);
  const patientDetails = useSelector(patientDetailsSelector);
  const isExchangeRatesModalOpen = useSelector(isExchangeRateModalOpenSelector);

  useEffect(() => {
    if (currentUser != null) {
      pubnub.setUUID(currentUser.id);
    }

    if (currentClinic != null) {
      dispatch(setClinic(currentClinic));
      pubnub.subscribe({
        channels: [`${currentClinic.id}-clinic-pubnub-channel`],
      });
      pubnub.addListener({ message: handlePubnubMessageReceived });
      return () => {
        pubnub.unsubscribe({
          channels: [`${currentClinic.id}-clinic-pubnub-channel`],
        });
      };
    }
  }, []);

  const handlePubnubMessageReceived = ({ message }) => {
    dispatch(handleRemoteMessage(message));
  };

  const pageTitle = useMemo(() => {
    return paths[currentPath];
  }, [currentPath]);

  const handleStartLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  const handleCreateClinic = () => {
    dispatch(setCreateClinic({ open: true, canClose: true }));
  };

  const handleChangeCompany = async (company) => {
    try {
      const { data: selectedClinic } = await changeCurrentClinic(company.clinicId);
      switch (selectedClinic.roleInClinic) {
        case Role.reception:
          const isPathRestricted = ['/analytics', '/services', '/users', '/messages']
            .some(item => router.asPath.startsWith(item));
          if (isPathRestricted) {
            await router.replace('/calendar/day');
          } else {
            await router.reload();
          }
          break;
        default:
          await router.reload();
          break;
      }
    } catch (error) {
      console.error(error)
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

  const handleClosePaymentModal = () => {
    dispatch(
      setPaymentModal({
        open: false,
        invoice: null,
        isNew: false,
        openPatientDetailsOnClose: false,
      }),
    );
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
          authToken={authToken}
          currentClinic={currentClinic}
          show={isImportModalOpen}
          onClose={handleCloseImportModal}
        />
      )}
      {appointmentModal?.open && (
        <AddAppointmentModal
          currentClinic={currentClinic}
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
      {paymentModal.open && (
        <CheckoutModal
          {...paymentModal}
          currentUser={currentUser}
          currentClinic={currentClinic}
          onClose={handleClosePaymentModal}
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
            title={pageTitle}
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
