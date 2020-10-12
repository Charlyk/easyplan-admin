import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconPlus from '../../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../../utils/localization';
import TreatmentPlan from './TreatmentPlan';

const TreatmentPlans = ({ patient }) => {
  return (
    <div className='patient-treatment-plans'>
      <div className='patient-treatment-plans__plans-data'>
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
        <TreatmentPlan />
      </div>
    </div>
  );
};

export default TreatmentPlans;

TreatmentPlans.propTypes = {
  patient: PropTypes.object,
};
