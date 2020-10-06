import React from 'react';

import { useParams } from 'react-router-dom';

const PatientDetails = props => {
  const { patientId } = useParams();
  return (
    <div>
      {patientId}
      <div />
    </div>
  );
};

export default PatientDetails;
