import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
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
import PatientDetails from '../PatientDetails';
import styles from './DoctorPatientDetails.module.scss';
import reducer, {
  initialState,
  setShowFinalizeTreatment,
  setIsFinalizing,
  setInitialData,
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

const DoctorPatientDetails = ({
  currentUser,
  currentClinic,
  schedule: initialSchedule,
  scheduleId,
  authToken,
}) => {
  const toast = useContext(NotificationsContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const clinicCurrency = currentClinic.currency;
  const [
    { patient, schedule, showFinalizeTreatment, isFinalizing, finalServices },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const [guideName, setGuideName] = useState(
    `${currentUser.firstName} ${currentUser.lastName}`,
  );

  const canFinalize =
    schedule?.scheduleStatus === 'OnSite' ||
    schedule?.scheduleStatus === 'CompletedNotPaid';

  useEffect(() => {
    // filter clinic services to get only provided by current user services
    localDispatch(setInitialData({ schedule: initialSchedule }));
  }, []);

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

      if (!canFinalize) {
        toast.success(textForKey('Saved successfully'));
      }
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
              <span className={styles.patientInfoValue}>
                {currentUser.fullName}
              </span>
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
            scheduleData={initialSchedule}
            scheduleId={scheduleId}
            onFinalize={handleFinalizeTreatment}
          />
        </div>
      </div>
      <div className={styles.rightContainer}>
        {patient && (
          <PatientDetails
            isDoctor
            currentClinic={currentClinic}
            currentUser={currentUser}
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
