import React, { useState } from 'react';

import PropTypes from 'prop-types';

import EasyTab from '../../../../components/EasyTab';
import { textForKey } from '../../../../utils/localization';
import AppointmentNotes from './appointmentNotes';
import PatientAppointments from './appointments/PatientAppointments';
import PatientNotes from './notes/PatientNotes';
import TreatmentPlans from './treatment-plans/TreatmentPlans';
import PatientXRay from './x-ray/PatientXRay';
import './styles.scss';

const TabId = {
  appointmentsNotes: 'AppointmentsNotes',
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
  treatmentPlans: 'TreatmentPlans',
};

const PatientDetails = ({
  onAddNote,
  onAddXRay,
  onAddAppointmentNote,
  showTabs,
  defaultTab,
  patient,
}) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  if (!patient) return null;

  const handleTabClick = selectedTab => {
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
      </div>
      <div className='patient-details-root__content'>
        {selectedTab === TabId.appointmentsNotes && (
          <AppointmentNotes
            patient={patient}
            onAddNote={onAddAppointmentNote}
          />
        )}
        {selectedTab === TabId.appointments && (
          <PatientAppointments patient={patient} />
        )}
        {selectedTab === TabId.notes && (
          <PatientNotes patient={patient} onAddNote={onAddNote} />
        )}
        {selectedTab === TabId.xRay && (
          <PatientXRay onAddXRay={onAddXRay} patient={patient} />
        )}
        {selectedTab === TabId.treatmentPlans && (
          <TreatmentPlans patient={patient} />
        )}
      </div>
    </div>
  );
};

export default PatientDetails;

PatientDetails.propTypes = {
  onAddNote: PropTypes.func,
  onAddXRay: PropTypes.func,
  onAddAppointmentNote: PropTypes.func,
  showTabs: PropTypes.arrayOf(PropTypes.string),
  defaultTab: PropTypes.string,
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};

PatientDetails.defaultProps = {
  showTabs: [TabId.appointments, TabId.xRay, TabId.notes, TabId.treatmentPlans],
  defaultTab: TabId.appointments,
};
