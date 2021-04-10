import React, { useEffect, useReducer } from 'react';

import { CircularProgress } from '@material-ui/core';
import sum from 'lodash/sum';
import moment from 'moment-timezone';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../../components/icons/iconAvatar';
import FinalizeTreatmentModal from '../../../components/doctors/FinalizeTreatmentModal';
import PatientDetails from '../../../components/doctors/PatientDetails';
import {
  setPatientNoteModal,
  setPatientXRayModal,
} from '../../../redux/actions/actions';
import { generateReducerActions, handleRequestError, redirectToUrl, redirectUserTo } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/DoctorPatientDetails.module.scss';
import axios from "axios";
import { useRouter } from "next/router";
import DoctorsMain from "../../../components/doctors/DoctorsMain";
import { fetchAppData } from "../../../middleware/api/initialization";
import { fetchDoctorScheduleDetails } from "../../../middleware/api/schedules";
import PatientTreatmentPlan from "../../../components/doctors/PatientTreatmentPlan";

const TabId = {
  appointmentsNotes: 'AppointmentsNotes',
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
  treatmentPlans: 'TreatmentPlans',
  orthodonticPlan: 'OrthodonticPlan',
};

const initialState = {
  patient: null,
  schedule: null,
  selectedServices: [],
  showFinalizeTreatment: false,
  isFinalizing: false,
  finalServices: [],
};

const reducerTypes = {
  setPatient: 'setPatient',
  setSchedule: 'setSchedule',
  setShowFinalizeTreatment: 'setShowFinalizeTreatment',
  setIsFinalizing: 'setIsFinalizing',
  setInitialData: 'setInitialData',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPatient:
      return { ...state, patient: action.payload };
    case reducerTypes.setSchedule:
      return { ...state, schedule: action.payload };
    case reducerTypes.setShowFinalizeTreatment: {
      const { open, finalServices, selectedServices } = action.payload;
      return {
        ...state,
        showFinalizeTreatment: open,
        finalServices: finalServices ?? [],
        selectedServices: selectedServices ?? [],
      };
    }
    case reducerTypes.setIsFinalizing:
      return { ...state, isFinalizing: action.payload };
    case reducerTypes.setInitialData: {
      const { schedule } = action.payload;
      return {
        ...state,
        schedule,
        patient: schedule.patient,
      };
    }
    default:
      return state;
  }
};

const DoctorPatientDetails = ({ currentUser, currentClinic, schedule: initialSchedule, scheduleId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const clinicCurrency = currentClinic.currency;
  const [
    {
      patient,
      schedule,
      selectedServices,
      showFinalizeTreatment,
      isFinalizing,
      finalServices,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const canFinalize =
    schedule?.scheduleStatus === 'OnSite' ||
    schedule?.scheduleStatus === 'CompletedNotPaid';

  useEffect(() => {
    // filter clinic services to get only provided by current user services
    localDispatch(
      actions.setInitialData({ schedule: initialSchedule })
    );
  }, []);

  /**
   * Handle start adding a note for patient
   */
  const handleAddNote = () => {
    dispatch(
      setPatientNoteModal({ open: true, patientId: patient.id, mode: 'notes' }),
    );
  };

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
   * Get treatment total price
   * @return {*}
   */
  const getTotalPrice = () => {
    const prices = selectedServices.map((item) => item.price);
    return sum(prices);
  };

  /**
   * Handle orthodontic plan saved
   */
  const handleSaveTreatmentPlan = async () => {
    await router.replace(router.asPath)
  };

  /**
   * Initiate treatment finalization
   */
  const handleFinalizeTreatment = (finalServices, selectedServices) => {
    if (canFinalize) {
      localDispatch(
        actions.setShowFinalizeTreatment({
          open: true,
          finalServices,
          selectedServices
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
    localDispatch(actions.setShowFinalizeTreatment({ open: false }));
  };

  const saveTreatmentPlan = async (requestBody, update) => {
    const url = `/api/treatment-plans/general`
    return update ? axios.put(url, requestBody) : axios.post(url, requestBody)
  }

  const updatePatientTreatmentPlan = async (requestBody) => {
    return saveTreatmentPlan(requestBody, true);
  }

  const savePatientTreatmentPlan = async (requestBody) => {
    return saveTreatmentPlan(requestBody, false);
  }

  /**
   * Save patient treatment plan services
   * @param {Array.<Object>} plannedServices
   * @return {Promise<void>}
   */
  const finalizeTreatment = async (plannedServices) => {
    handleCloseFinalizeTreatment();
    localDispatch(actions.setIsFinalizing(true));

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
      router.back()
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsFinalizing(false))
    }
  };

  return (
    <DoctorsMain currentUser={currentUser} currentClinic={currentClinic}>
      <div className={styles['doctor-patient-root']}>
        <FinalizeTreatmentModal
          currentClinic={currentClinic}
          onSave={finalizeTreatment}
          totalPrice={getTotalPrice()}
          services={finalServices}
          open={showFinalizeTreatment}
          onClose={handleCloseFinalizeTreatment}
        />
        <Modal
          centered
          className='loading-modal'
          show={isFinalizing}
          onHide={() => null}
        >
          <Modal.Body>
            <CircularProgress className='circular-progress-bar'/>
            {isFinalizing && textForKey('Finalizing treatment...')}
          </Modal.Body>
        </Modal>
        <div className={styles['left-container']}>
          <div className={styles['patient-info']}>
            <IconAvatar/>
            <div className={styles['personal-data-container']}>
              <span className={styles['patient-name']}>{getPatientName()}</span>
              <div className={styles['patient-info-row']}>
                <span className={styles['patient-info-title']}>{textForKey('Date')}:</span>
                <span className={styles['patient-info-value']}>
                {schedule
                  ? moment(schedule.startTime).format('DD MMM YYYY HH:mm')
                  : ''}
              </span>
              </div>
              <div className={styles['patient-info-row']}>
              <span className={styles['patient-info-title']}>
                {textForKey('Doctor')}:
              </span>
                <span className={styles['patient-info-value']}>{currentUser.fullName}</span>
              </div>
            </div>
          </div>
          <PatientTreatmentPlan
            currentClinic={currentClinic}
            currentUser={currentUser}
            scheduleData={initialSchedule}
            scheduleId={scheduleId}
            onFinalize={handleFinalizeTreatment}
          />
        </div>
        <div className={styles['right-container']}>
          {patient && (
            <PatientDetails
              isDoctor
              currentClinic={currentClinic}
              currentUser={currentUser}
              scheduleId={schedule.id}
              onAddXRay={handleAddXRay}
              onAddNote={handleAddNote}
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
    </DoctorsMain>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/doctor');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { scheduleId } = query;
    const response = await fetchDoctorScheduleDetails(scheduleId, null, req.headers);
    return {
      props: {
        scheduleId,
        schedule: response.data,
        ...appData,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {}
    }
  }
}

export default DoctorPatientDetails;
