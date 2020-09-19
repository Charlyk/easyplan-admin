import React, { useState } from 'react';

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

const PatientDetails = props => {
  const [selectedTab, setSelectedTab] = useState(TabId.xRay);

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
        {selectedTab === TabId.notes && <PatientNotes />}
        {selectedTab === TabId.xRay && <PatientXRay />}
        {selectedTab === TabId.treatmentPlans && <TreatmentPlans />}
      </div>
    </div>
  );
};

export default PatientDetails;
