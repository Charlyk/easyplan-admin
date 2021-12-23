import React, { useContext, useEffect, useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import AudioPlayer from 'react-h5-audio-player';
import { useDispatch, useSelector } from 'react-redux';
import IconClose from 'app/components/icons/iconClose';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import getCallRecordUrl from 'app/utils/getCallRecordUrl';
import paths from 'app/utils/paths';
import redirectIfOnGeneralHost from 'app/utils/redirectIfOnGeneralHost';
import { signOut } from 'middleware/api/auth';
import {
  setPatientNoteModal,
  setPatientXRayModal,
  setPaymentModal,
} from 'redux/actions/actions';
import { setIsExchangeRatesModalOpen } from 'redux/actions/exchangeRatesActions';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
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
  phoneCallRecordSelector,
} from 'redux/selectors/rootSelector';
import {
  playPhoneCallRecord,
  setPatientDetails,
  toggleImportModal,
  triggerUserLogOut,
} from 'redux/slices/mainReduxSlice';
import ReminderNotification from '../ReminderNotification';
import styles from './MainComponent.module.scss';

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
  const paymentModal = useSelector(paymentModalSelector);
  const patientXRayModal = useSelector(patientXRayModalSelector);
  const patientNoteModal = useSelector(patientNoteModalSelector);
  const isImportModalOpen = useSelector(isImportModalOpenSelector);
  const patientDetails = useSelector(patientDetailsSelector);
  const newReminder = useSelector(newReminderSelector);
  const updatedReminder = useSelector(updatedReminderSelector);
  const callToPlay = useSelector(phoneCallRecordSelector);
  const isExchangeRatesModalOpen = useSelector(isExchangeRateModalOpenSelector);
  const clinicAccessChange = useSelector(userClinicAccessChangeSelector);
  let childrenProps = children.props;
  if (provideAppData) {
    childrenProps = { ...childrenProps, currentUser, currentClinic, authToken };
  }

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

  const headerTitle = useMemo(() => {
    return paths[currentPath];
  }, [currentPath]);

  const pageTitle = useMemo(() => {
    if (currentClinic == null) {
      return `EasyPlan.pro - ${headerTitle}`;
    }
    return `${currentClinic.clinicName} - ${headerTitle}`;
  }, [headerTitle, currentClinic]);

  const handleStartLogout = () => {
    dispatch(triggerUserLogOut(true));
  };

  const handleCreateClinic = async () => {
    await router.push('/create-clinic?redirect=0');
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

  const handleClosePlayer = () => {
    dispatch(playPhoneCallRecord(null));
  };

  const handlePlayerError = () => {
    if (callToPlay?.fileUrl?.endsWith('.wav')) {
      dispatch(
        playPhoneCallRecord({
          ...callToPlay,
          fileUrl: callToPlay.fileUrl.replace('.wav', '.ogg'),
        }),
      );
    } else {
      toast.error('Play error');
    }
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
        <title>{pageTitle}</title>
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
          {paymentModal.open && (
            <CheckoutModal
              {...paymentModal}
              currentUser={currentUser}
              currentClinic={currentClinic}
              onClose={handleClosePaymentModal}
            />
          )}
          {callToPlay != null && (
            <div className={styles.playerContainer}>
              <IconButton
                className={styles.closeIcon}
                onClick={handleClosePlayer}
              >
                <IconClose />
              </IconButton>
              <AudioPlayer
                autoPlay
                src={getCallRecordUrl(callToPlay)}
                className={styles.player}
                onError={handlePlayerError}
                showJumpControls={false}
                showSkipControls={false}
                onPlayError={handlePlayerError}
              />
            </div>
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
              title={headerTitle}
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
