import React, { useState } from 'react';

import PropTypes from 'prop-types';

import EasyTab from '../../../../components/EasyTab';
import { textForKey } from '../../../../utils/localization';
import PatientAppointments from './appointments/PatientAppointments';
import PatientNotes from './notes/PatientNotes';
import TreatmentPlans from './treatment-plans/TreatmentPlans';
import PatientXRay from './x-ray/PatientXRay';

const TabId = {
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
  treatmentPlans: 'TreatmentPlans',
};

const PatientDetails = ({ onAddNote, patient, shouldUpdate }) => {
  const [selectedTab, setSelectedTab] = useState(TabId.notes);

  if (!patient) return null;

  const handleTabClick = selectedTab => {
    setSelectedTab(selectedTab);
  };

  return (
    <div className='patients-root__details'>
      <div className='patients-root__details__header'>
        <EasyTab
          title={textForKey('Appointments')}
          onClick={() => handleTabClick(TabId.appointments)}
          selected={selectedTab === TabId.appointments}
        />
        <EasyTab
          title={textForKey('Notes')}
          onClick={() => handleTabClick(TabId.notes)}
          selected={selectedTab === TabId.notes}
        />
        <EasyTab
          title={textForKey('X-Ray')}
          onClick={() => handleTabClick(TabId.xRay)}
          selected={selectedTab === TabId.xRay}
        />
        <EasyTab
          title={textForKey('Treatment plans')}
          onClick={() => handleTabClick(TabId.treatmentPlans)}
          selected={selectedTab === TabId.treatmentPlans}
        />
      </div>
      <div className='patients-root__details__content'>
        {selectedTab === TabId.appointments && <PatientAppointments />}
        {selectedTab === TabId.notes && (
          <PatientNotes
            patient={patient}
            onAddNote={onAddNote}
            shouldUpdate={shouldUpdate}
          />
        )}
        {selectedTab === TabId.xRay && <PatientXRay />}
        {selectedTab === TabId.treatmentPlans && <TreatmentPlans />}
      </div>
    </div>
  );
};

export default PatientDetails;

PatientDetails.propTypes = {
  onAddNote: PropTypes.func,
  shouldUpdate: PropTypes.bool,
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};
