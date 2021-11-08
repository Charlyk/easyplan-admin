import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Typography from "@material-ui/core/Typography";
import { usePubNub } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import useSWR from "swr";
import { toast } from "react-toastify";
import {
  setAppointmentModal,
  setPatientDetails,
  setPaymentModal,
  toggleImportModal,
  triggerUserLogout,
} from '../../../../redux/actions/actions';
import { appointmentModalSelector, paymentModalSelector } from '../../../../redux/selectors/modalsSelector';
import {
  isImportModalOpenSelector,
  patientDetailsSelector,
} from '../../../../redux/selectors/rootSelector';
import paths from '../../../utils/paths';
import { signOut } from "../../../../middleware/api/auth";
import { isExchangeRateModalOpenSelector } from "../../../../redux/selectors/exchangeRatesModalSelector";
import { setIsExchangeRatesModalOpen } from "../../../../redux/actions/exchangeRatesActions";
import { newReminderSelector, updatedReminderSelector } from "../../../../redux/selectors/crmSelector";
import { userClinicAccessChangeSelector } from "../../../../redux/selectors/clinicDataSelector";
import { handleRemoteMessage } from "../../../utils/pubnubUtils";
import { setClinic } from "../../../../redux/actions/clinicActions";
import { environment, isDev } from "../../../../eas.config";
import redirectIfOnGeneralHost from "../../../utils/redirectIfOnGeneralHost";
import areComponentPropsEqual from "../../../utils/areComponentPropsEqual";
import { APP_DATA_API } from "../../../utils/constants";
import ReminderNotification from "../ReminderNotification";
import styles from './MainComponent.module.scss';

const AddAppointmentModal = dynamic(() => import('../../dashboard/calendar/modals/AddAppointmentModal'));
const PatientDetailsModal = dynamic(() => import('../../dashboard/patients/PatientDetailsModal'));
const DataMigrationModal = dynamic(() => import('../modals/DataMigrationModal'));
const ExchangeRatesModal = dynamic(() => import('../modals/ExchangeRatesModal'));
const CheckoutModal = dynamic(() => import('../modals/CheckoutModal'));
const MainMenu = dynamic(() => import('./MainMenu'));
const PageHeader = dynamic(() => import('./PageHeader'));

const MainComponent = (
  {
    children,
    currentPath,
    provideAppData = true,
    authToken
  }
) => {
  const { data, error } = useSWR(APP_DATA_API);
  const { currentUser, currentClinic } = data;

  if (error) return 'An error has occurred';
  if (!data) return 'Loading...';

  const pubnub = usePubNub();
  const router = useRouter();
  const dispatch = useDispatch();
  const appointmentModal = useSelector(appointmentModalSelector);
  const paymentModal = useSelector(paymentModalSelector);
  const isImportModalOpen = useSelector(isImportModalOpenSelector);
  const patientDetails = useSelector(patientDetailsSelector);
  const newReminder = useSelector(newReminderSelector);
  const updatedReminder = useSelector(updatedReminderSelector);
  const isExchangeRatesModalOpen = useSelector(isExchangeRateModalOpenSelector);
  const clinicAccessChange = useSelector(userClinicAccessChangeSelector);
  let childrenProps = children.props;
  if (provideAppData) {
    childrenProps = { ...childrenProps, currentUser, currentClinic, authToken };
  }

  useEffect(() => {
    redirectIfOnGeneralHost(currentUser, router);
    if (currentUser != null) {
      pubnub.setUUID(currentUser.id);
    }

    if (currentClinic != null) {
      const { id } = currentClinic;
      dispatch(setClinic(currentClinic));
      pubnub.subscribe({
        channels: [`${id}-${environment}-clinic-pubnub-channel`],
      });
      pubnub.addListener({ message: handlePubnubMessageReceived });
      return () => {
        pubnub.unsubscribe({
          channels: [`${id}-${environment}-clinic-pubnub-channel`],
        });
      };
    } else {
      return () => {
        pubnub.unsubscribeAll();
      }
    }
  }, [currentUser, currentClinic]);

  useEffect(() => {
    if (newReminder == null || newReminder.assignee.id !== currentUser.id) {
      return;
    }

    toast(<ReminderNotification reminder={newReminder}/>, { toastId: newReminder.id });
  }, [newReminder, currentUser]);

  useEffect(() => {
    if (
      updatedReminder == null ||
      updatedReminder.assignee.id !== currentUser.id ||
      updatedReminder.completed
    ) {
      return;
    }
    toast(<ReminderNotification isUpdate reminder={updatedReminder}/>, { toastId: updatedReminder.id });
  }, [updatedReminder, currentUser]);

  useEffect(() => {
    handleUserAccessChange();
  }, [clinicAccessChange, currentUser, currentClinic]);

  const handleUserAccessChange = async () => {
    if (
      clinicAccessChange == null ||
      currentUser == null ||
      currentClinic == null ||
      clinicAccessChange.clinicId !== currentClinic.id ||
      clinicAccessChange.userId !== currentUser.id ||
      !clinicAccessChange.accessBlocked
    ) {
      return;
    }
    try {
      await signOut();
      await router.replace(router.asPath)
    } catch (error) {
      console.log(error);
    }
  };

  const handlePubnubMessageReceived = ({ message }) => {
    dispatch(handleRemoteMessage(message));
  };

  const pageTitle = useMemo(() => {
    return paths[currentPath];
  }, [currentPath]);

  const handleStartLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  const handleCreateClinic = async () => {
    await router.push('/create-clinic?redirect=0')
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
        schedule: null,
        openPatientDetailsOnClose: false,
      }),
    );
  };

  return (
    <div className={styles.mainPage} id='main-page'>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {isExchangeRatesModalOpen && (
        <ExchangeRatesModal
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
          authToken={authToken}
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
        />
      )}
      {currentUser != null && (
        <div className={styles.dataContainer}>
          <PageHeader
            currentClinic={currentClinic}
            title={pageTitle}
            user={currentUser}
            onLogout={handleStartLogout}
          />
          <div className={styles.data}>
            {currentClinic != null && (
              React.cloneElement(
                children,
                childrenProps,
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MainComponent, areComponentPropsEqual);

MainComponent.propTypes = {
  currentPath: PropTypes.string,
};

MainComponent.defaultProps = {
  currentPath: '/',
};
