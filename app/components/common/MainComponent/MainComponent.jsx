import React, { useContext, useEffect, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import paths from 'app/utils/paths';
import redirectIfOnGeneralHost from 'app/utils/redirectIfOnGeneralHost';
import { isDev } from 'eas.config';
import { signOut } from 'middleware/api/auth';
import {
  setPatientDetails,
  setPatientNoteModal,
  setPatientXRayModal,
  setPaymentModal,
  toggleImportModal,
  triggerUserLogout,
} from 'redux/actions/actions';
import { setIsExchangeRatesModalOpen } from 'redux/actions/exchangeRatesActions';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { appointmentModalSelector } from 'redux/selectors/appointmentModalSelector';
import { userClinicAccessChangeSelector } from 'redux/selectors/clinicDataSelector';
import {
  newReminderSelector,
  updatedReminderSelector,
} from 'redux/selectors/crmSelector';
import { isExchangeRateModalOpenSelector } from 'redux/selectors/exchangeRatesModalSelector';
import {
  patientNoteModalSelector,
  patientXRayModalSelector,
  paymentModalSelector,
} from 'redux/selectors/modalsSelector';
import {
  isImportModalOpenSelector,
  patientDetailsSelector,
} from 'redux/selectors/rootSelector';
import { closeAppointmentModal } from 'redux/slices/createAppointmentModalSlice';
import ReminderNotification from '../ReminderNotification';
import styles from './MainComponent.module.scss';

const AddAppointmentModal = dynamic(() =>
  import('app/components/dashboard/calendar/modals/AddAppointmentModal'),
);
const PatientDetailsModal = dynamic(() =>
  import('app/components/dashboard/patients/PatientDetailsModal'),
);
const AddXRay = dynamic(() =>
  import('app/components/dashboard/patients/AddXRay'),
);
const AddNote = dynamic(() => import('../modals/AddNote'));
const DataMigrationModal = dynamic(() =>
  import('../modals/DataMigrationModal'),
);
const ExchangeRatesModal = dynamic(() =>
  import('../modals/ExchangeRatesModal'),
);
const CheckoutModal = dynamic(() => import('../modals/CheckoutModal'));
const MainMenu = dynamic(() => import('./MainMenu'));
const PageHeader = dynamic(() => import('./PageHeader'));

const MainComponent = ({ children, currentPath, provideAppData = true }) => {
  const toast = useContext(NotificationsContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const currentClinic = useSelector(currentClinicSelector);
  const currentUser = useSelector(currentUserSelector);
  const authToken = useSelector(authTokenSelector);
  const appointmentModal = useSelector(appointmentModalSelector);
  const paymentModal = useSelector(paymentModalSelector);
  const patientXRayModal = useSelector(patientXRayModalSelector);
  const patientNoteModal = useSelector(patientNoteModalSelector);
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

  console.log('The current user is:', currentUser);

  console.log('The current clinic is:', currentClinic);

  useEffect(() => {
    redirectIfOnGeneralHost(currentUser, router);
  }, [currentUser, router]);

  useEffect(() => {
    if (newReminder == null || newReminder.assignee.id !== currentUser.id) {
      return;
    }

    toast.show(<ReminderNotification reminder={newReminder} />, {
      toastId: newReminder.id,
    });
  }, [newReminder, currentUser]);

  useEffect(() => {
    if (
      updatedReminder == null ||
      updatedReminder.assignee.id !== currentUser.id ||
      updatedReminder.completed
    ) {
      return;
    }
    toast.show(<ReminderNotification isUpdate reminder={updatedReminder} />, {
      toastId: updatedReminder.id,
    });
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
      await router.replace(router.asPath);
    } catch (error) {
      console.error(error);
    }
  };

  const pageTitle = useMemo(() => {
    return paths[currentPath];
  }, [currentPath]);

  const handleStartLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  const handleCreateClinic = async () => {
    await router.push('/create-clinic?redirect=0');
  };

  const handleAppointmentModalClose = () => {
    dispatch(closeAppointmentModal());
  };

  const handleClosePatientDetails = () => {
    dispatch(
      setPatientDetails({ show: false, patientId: null, canDelete: false }),
    );
  };

  const handleCloseExchangeRateModal = () => {
    dispatch(setIsExchangeRatesModalOpen(false));
  };

  const handleCloseImportModal = () => {
    dispatch(toggleImportModal());
  };

  const handleClosePatientXRayModal = () => {
    dispatch(setPatientXRayModal({ open: false, patientId: null }));
  };

  const handleClosePatientNoteModal = () => {
    dispatch(setPatientNoteModal({ open: false }));
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
      <Head>
        <title>
          {currentClinic?.clinicName} - {pageTitle}
        </title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      {currentUser != null && currentClinic != null && (
        <>
          {patientNoteModal.open && (
            <AddNote
              {...patientNoteModal}
              onClose={handleClosePatientNoteModal}
            />
          )}
          {patientXRayModal.open && (
            <AddXRay
              {...patientXRayModal}
              currentClinic={currentClinic}
              authToken={authToken}
              onClose={handleClosePatientXRayModal}
            />
          )}
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
              cabinet={appointmentModal?.cabinet}
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
          <MainMenu
            currentClinic={currentClinic}
            currentUser={currentUser}
            currentPath={currentPath}
            onCreateClinic={handleCreateClinic}
          />
          <div className={styles.dataContainer}>
            <PageHeader
              currentClinic={currentClinic}
              title={pageTitle}
              user={currentUser}
              onLogout={handleStartLogout}
            />
            <div className={styles.data}>
              {React.cloneElement(children, childrenProps)}
            </div>
          </div>
        </>
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
