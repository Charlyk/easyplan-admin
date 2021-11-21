import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EasyTab from 'app/components/common/EasyTab';
import AppointmentNotes from 'app/components/dashboard/patients/PatientDetailsModal/AppointmentNotes';
import OrthodonticPlan from 'app/components/dashboard/patients/PatientDetailsModal/OrthodonticPlan';
import PatientAppointments from 'app/components/dashboard/patients/PatientDetailsModal/PatientAppointments';
import PatientNotes from 'app/components/dashboard/patients/PatientDetailsModal/PatientNotes';
import PatientXRay from 'app/components/dashboard/patients/PatientDetailsModal/PatientXRay';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import { requestFetchPatientNotes } from 'middleware/api/patients';
import { clinicEnabledBracesSelector } from 'redux/selectors/clinicSelector';
import styles from './PatientDetails.module.scss';

const TabId = {
  appointmentsNotes: 'AppointmentsNotes',
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
  treatmentPlans: 'TreatmentPlans',
  orthodonticPlan: 'OrthodonticPlan',
};

const PatientDetails = ({
  currentUser,
  currentClinic,
  onAddXRay,
  onEditAppointmentNote,
  onSaveOrthodonticPlan,
  showTabs,
  defaultTab,
  patient,
  scheduleId,
  isDoctor,
}) => {
  const toast = useContext(NotificationsContext);
  const braces = clinicEnabledBracesSelector(currentClinic);
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [hasNotes, setHasNotes] = useState(false);

  useEffect(() => {
    if (showTabs.includes(TabId.notes) && isDoctor) {
      fetchPatientNotes();
    }
  }, [showTabs]);

  const fetchPatientNotes = async () => {
    if (patient == null) {
      return;
    }

    try {
      const response = await requestFetchPatientNotes(patient.id);
      setHasNotes(response.data.length > 0);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!patient) return null;

  const handleTabClick = (selectedTab) => {
    setSelectedTab(selectedTab);
  };

  return (
    <div className={styles.patientDetailsRoot}>
      <div className={styles.header}>
        {showTabs.includes(TabId.appointmentsNotes) && (
          <EasyTab
            title={textForKey('Appointments notes')}
            onClick={() => handleTabClick(TabId.appointmentsNotes)}
            selected={selectedTab === TabId.appointmentsNotes}
          />
        )}

        {showTabs.includes(TabId.appointments) && (
          <EasyTab
            title={textForKey('Appointments')}
            onClick={() => handleTabClick(TabId.appointments)}
            selected={selectedTab === TabId.appointments}
          />
        )}

        {showTabs.includes(TabId.notes) && (
          <EasyTab
            title={textForKey('Notes')}
            highlighted={hasNotes}
            onClick={() => handleTabClick(TabId.notes)}
            selected={selectedTab === TabId.notes}
          />
        )}

        {showTabs.includes(TabId.xRay) && (
          <EasyTab
            title={textForKey('X-Ray')}
            onClick={() => handleTabClick(TabId.xRay)}
            selected={selectedTab === TabId.xRay}
          />
        )}

        {showTabs.includes(TabId.treatmentPlans) && (
          <EasyTab
            title={textForKey('Treatment plan')}
            onClick={() => handleTabClick(TabId.treatmentPlans)}
            selected={selectedTab === TabId.treatmentPlans}
          />
        )}
        {showTabs.includes(TabId.orthodonticPlan) && braces.length > 0 && (
          <EasyTab
            title={textForKey('Orthodontic plan')}
            onClick={() => handleTabClick(TabId.orthodonticPlan)}
            selected={selectedTab === TabId.orthodonticPlan}
          />
        )}
      </div>
      <div className={styles.content}>
        {selectedTab === TabId.appointmentsNotes && (
          <AppointmentNotes
            currentUser={currentUser}
            scheduleId={scheduleId}
            patient={patient}
            onEditNote={onEditAppointmentNote}
          />
        )}
        {selectedTab === TabId.appointments && (
          <PatientAppointments patient={patient} isDoctor={isDoctor} />
        )}
        {selectedTab === TabId.notes && <PatientNotes patient={patient} />}
        {selectedTab === TabId.xRay && (
          <PatientXRay onAddXRay={onAddXRay} patient={patient} />
        )}
        {selectedTab === TabId.orthodonticPlan && braces.length > 0 && (
          <OrthodonticPlan
            currentClinic={currentClinic}
            currentUser={currentUser}
            patient={patient}
            scheduleId={scheduleId}
            onSave={onSaveOrthodonticPlan}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDetails;

PatientDetails.propTypes = {
  scheduleId: PropTypes.number,
  isDoctor: PropTypes.bool,
  onAddNote: PropTypes.func,
  onAddXRay: PropTypes.func,
  onEditAppointmentNote: PropTypes.func,
  onSaveOrthodonticPlan: PropTypes.func,
  showTabs: PropTypes.arrayOf(PropTypes.string),
  defaultTab: PropTypes.string,
  patient: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

PatientDetails.defaultProps = {
  showTabs: [
    TabId.appointmentsNotes,
    TabId.appointments,
    TabId.xRay,
    TabId.notes,
    TabId.orthodonticPlan,
  ],
  defaultTab: TabId.appointmentsNotes,
  onSaveOrthodonticPlan: () => null,
};
