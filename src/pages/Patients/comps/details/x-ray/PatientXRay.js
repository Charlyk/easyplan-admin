import React, { useState } from 'react';

import PropTypes from 'prop-types';

import XRayPhase from './XRayPhase';

const ExpandedPhase = {
  initial: 'initial',
  middle: 'middle',
  final: 'final',
};

const PatientXRay = ({ patient }) => {
  const [expandedPhase, setExpandedPhase] = useState(ExpandedPhase.initial);

  const handlePhaseToggle = newPhase => {
    setExpandedPhase(newPhase);
  };

  return (
    <div className='patients-root__x-ray'>
      <XRayPhase
        title='Initial phase'
        isExpanded={expandedPhase === ExpandedPhase.initial}
        images={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
        phaseId={ExpandedPhase.initial}
        onExpand={handlePhaseToggle}
      />
      <XRayPhase
        title='Middle phase'
        isExpanded={expandedPhase === ExpandedPhase.middle}
        images={[
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
        ]}
        phaseId={ExpandedPhase.middle}
        onExpand={handlePhaseToggle}
      />
      <XRayPhase
        title='Final phase'
        isExpanded={expandedPhase === ExpandedPhase.final}
        images={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
        phaseId={ExpandedPhase.final}
        onExpand={handlePhaseToggle}
      />
    </div>
  );
};

export default PatientXRay;

PatientXRay.propTypes = {
  patient: PropTypes.object,
};
