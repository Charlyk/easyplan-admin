import React, { useContext, useMemo, useReducer, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import EASPersistentModal from 'app/components/common/modals/EASPersistentModal';
import PatientTreatmentPlan from 'app/components/common/PatientTreatmentPlan';
import IconAvatar from 'app/components/icons/iconAvatar';
import NotificationsContext from 'app/context/notificationsContext';
import getErrorMessage from 'app/utils/getErrorMessage';
import getTreatmentPlanURL from 'app/utils/getTreatmentPlanURL';
import { textForKey } from 'app/utils/localization';
import {
  savePatientGeneralTreatmentPlan,
  updatePatientGeneralTreatmentPlan,
} from 'middleware/api/patients';
import {
  setPatientNoteModal,
  setPatientXRayModal,
} from 'redux/actions/actions';
import {
  authTokenSelector,
  clinicCurrencySelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import {
  scheduleDetailsSelector,
  scheduleIdSelector,
  schedulePatientSelector,
} from 'redux/selectors/doctorScheduleDetailsSelector';
import PatientDetails from '../PatientDetails';
import styles from './DoctorPatientDetails.module.scss';
import reducer, {
  initialState,
  setShowFinalizeTreatment,
  setIsFinalizing,
} from './DoctorPatientDetails.reducer';

const FinalizeTreatmentModal = dynamic(() =>
  import('app/components/doctors/FinalizeTreatmentModal'),
);

const TabId = {
  appointmentsNotes: 'AppointmentsNotes',
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
  treatmentPlans: 'TreatmentPlans',
  orthodonticPlan: 'OrthodonticPlan',
};

const DoctorPatientDetails = () => {
  const toast = useContext(NotificationsContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const scheduleId = useSelector(scheduleIdSelector);
  const schedule = useSelector(scheduleDetailsSelector);
  const patient = useSelector(schedulePatientSelector);
  const authToken = useSelector(authTokenSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const currentUser = useSelector(currentUserSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const [
    { showFinalizeTreatment, isFinalizing, finalServices },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const pageTitle = `${currentClinic.clinicName} - ${patient.fullName}`;

  const [guideName, setGuideName] = useState(
    `${currentUser.firstName} ${currentUser.lastName}`,
  );

  const canFinalize =
    schedule?.scheduleStatus === 'OnSite' ||
    schedule?.scheduleStatus === 'CompletedNotPaid';

  /**
   * Handle start adding x-ray image
   */
  const handleAddXRay = () => {
    dispatch(setPatientXRayModal({ open: true, patientId: patient.id }));
  };

  /**
   * Handle appointment note change started
   * @param {Object} visit
   */
  const handleEditAppointmentNote = (visit) => {
    dispatch(
      setPatientNoteModal({
        open: true,
        patientId: patient.id,
        mode: 'visits',
        visit: visit,
        scheduleId: schedule.id,
      }),
    );
  };

  /**
   * Get patient full name
   * @return {string}
   */
  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    } else if (patient?.firstName) {
      return patient.firstName;
    } else if (patient?.lastName) {
      return patient.lastName;
    } else {
      return patient?.phoneNumber || '';
    }
  };

  /**
   * Handle orthodontic plan saved
   */
  const handleSaveTreatmentPlan = async () => {
    await router.replace(router.asPath);
  };

  /**
   * Initiate treatment finalization
   */
  const handleFinalizeTreatment = (finalServices, selectedServices) => {
    if (canFinalize) {
      localDispatch(
        setShowFinalizeTreatment({
          open: true,
          finalServices,
          selectedServices,
        }),
      );
    } else {
      finalizeTreatment(selectedServices);
    }
  };

  /**
   * Close finalize treatment modal
   */
  const handleCloseFinalizeTreatment = () => {
    localDispatch(setShowFinalizeTreatment({ open: false }));
  };

  const saveTreatmentPlan = async (requestBody, update) => {
    return update
      ? updatePatientGeneralTreatmentPlan(requestBody)
      : savePatientGeneralTreatmentPlan(requestBody);
  };

  const updatePatientTreatmentPlan = async (requestBody) => {
    return saveTreatmentPlan(requestBody, true);
  };

  const savePatientTreatmentPlan = async (requestBody) => {
    return saveTreatmentPlan(requestBody, false);
  };

  /**
   * Save patient treatment plan services
   * @param {Array.<Object>} plannedServices
   * @return {Promise<void>}
   */
  const finalizeTreatment = async (plannedServices) => {
    handleCloseFinalizeTreatment();
    localDispatch(setIsFinalizing(true));

    try {
      let services = plannedServices;
      if (!canFinalize) {
        services = plannedServices.filter((item) => !item.isExistent);
      }

      const requestBody = {
        scheduleId: schedule.id,
        patientId: patient.id,
        services: services.map((item) => ({
          id: item.planServiceId,
          serviceId: item.id,
          toothId: item.toothId,
          completed: item.isSelected,
          destination: item.destination,
          isBraces: item.isBraces,
          count: item.count || 1,
          price: item.price,
          currency: item.currency || clinicCurrency,
        })),
      };

      canFinalize
        ? await savePatientTreatmentPlan(requestBody)
        : await updatePatientTreatmentPlan(requestBody);

      router.back();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      localDispatch(setIsFinalizing(false));
    }
  };

  const handleGuideNameChange = (newValue) => {
    setGuideName(newValue);
  };

  const handlePrintTreatmentPlan = () => {
    const planUrl = getTreatmentPlanURL(
      currentClinic,
      authToken,
      patient.id,
      guideName,
    );
    window.open(planUrl, '_blank');
  };

  const formattedTime = useMemo(() => {
    if (schedule == null) {
      return '';
    }
    const startTime = moment(schedule.startTime).format('DD.MM.YYYY HH:mm');
    const endTime = moment(schedule.endTime).format('HH:mm');
    return `${startTime} - ${endTime}`;
  }, [schedule]);

  return (
    <div className={styles.doctorPatientRoot}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <FinalizeTreatmentModal
        currentClinic={currentClinic}
        onSave={finalizeTreatment}
        services={finalServices}
        open={showFinalizeTreatment}
        onClose={handleCloseFinalizeTreatment}
      />
      <EASPersistentModal open={isFinalizing}>
        <div className={styles.progressBar}>
          <CircularProgress className='circular-progress-bar' />
        </div>
        {isFinalizing && (
          <Typography className={styles.loadingLabel}>
            {textForKey('Finalizing treatment...')}
          </Typography>
        )}
      </EASPersistentModal>
      <div className={styles.leftContainer}>
        <div className={styles.patientInfo}>
          <IconAvatar />
          <div className={styles.personalDataContainer}>
            <span className={styles.patientName}>{getPatientName()}</span>
            <div className={styles.patientInfoRow}>
              <span className={styles.patientInfoTitle}>
                {textForKey('Date')}:
              </span>
              <span className={styles.patientInfoValue}>{formattedTime}</span>
            </div>
            <div className={styles.patientInfoRow}>
              <span className={styles.patientInfoTitle}>
                {textForKey('Doctor')}:
              </span>
              <Typography className={styles.patientInfoValue} noWrap>
                {currentUser.fullName}
              </Typography>
            </div>
          </div>
          <div className={styles.printableWrapper}>
            <EASTextField
              containerClass={styles.guideNameField}
              value={guideName}
              fieldLabel={textForKey('Enter guide name')}
              onChange={handleGuideNameChange}
            />
            <Button
              className='positive-button'
              onPointerUp={handlePrintTreatmentPlan}
            >
              {textForKey('Print plan')}
            </Button>
          </div>
        </div>
        <div className={styles.treatmentPlanWrapper}>
          <PatientTreatmentPlan
            currentClinic={currentClinic}
            currentUser={currentUser}
            scheduleData={schedule}
            scheduleId={scheduleId}
            onFinalize={handleFinalizeTreatment}
          />
        </div>
      </div>
      <div className={styles.rightContainer}>
        {patient && (
          <PatientDetails
            isDoctor
            scheduleId={schedule.id}
            onAddXRay={handleAddXRay}
            onSaveOrthodonticPlan={handleSaveTreatmentPlan}
            onEditAppointmentNote={handleEditAppointmentNote}
            patient={patient}
            defaultTab={TabId.notes}
            showTabs={[
              TabId.appointments,
              TabId.orthodonticPlan,
              TabId.appointmentsNotes,
              TabId.xRay,
              TabId.notes,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorPatientDetails;
