import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import EasyTab from '../../../../components/EasyTab';
import AppointmentNotes from '../../../../components/PatientDetailsModal/AppointmentNotes';
import PatientAppointments from '../../../../components/PatientDetailsModal/PatientAppointments';
import PatientNotes from '../../../../components/PatientDetailsModal/PatientNotes';
import OrthodonticPlan from '../../../../components/PatientDetailsModal/OrthodonticPlan';
import PatientXRay from '../../../../components/PatientDetailsModal/PatientXRay';
import { clinicEnabledBracesSelector } from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';

const TabId = {
  appointmentsNotes: 'AppointmentsNotes',
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
  treatmentPlans: 'TreatmentPlans',
  orthodonticPlan: 'OrthodonticPlan',
};

const PatientDetails = ({
  onAddNote,
  onAddXRay,
  onEditAppointmentNote,
  onSaveOrthodonticPlan,
  showTabs,
  defaultTab,
  patient,
  scheduleId,
  isDoctor,
}) => {
  const braces = useSelector(clinicEnabledBracesSelector);
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

    const response = await dataAPI.fetchPatientNotes(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setHasNotes(response.data.length > 0);
    }
  };

  if (!patient) return null;

  const handleTabClick = (selectedTab) => {
    setSelectedTab(selectedTab);
  };

  return (
    <div className='patient-details-root'>
      <div className='patient-details-root__header'>
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
      <div className='patient-details-root__content'>
        {selectedTab === TabId.appointmentsNotes && (
          <AppointmentNotes
            scheduleId={scheduleId}
            patient={patient}
            onEditNote={onEditAppointmentNote}
          />
        )}
        {selectedTab === TabId.appointments && (
          <PatientAppointments patient={patient} isDoctor={isDoctor} />
        )}
        {selectedTab === TabId.notes && (
          <PatientNotes patient={patient} onAddNote={onAddNote} />
        )}
        {selectedTab === TabId.xRay && (
          <PatientXRay onAddXRay={onAddXRay} patient={patient} />
        )}
        {selectedTab === TabId.orthodonticPlan && braces.length > 0 && (
          <OrthodonticPlan
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
  scheduleId: PropTypes.string,
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
