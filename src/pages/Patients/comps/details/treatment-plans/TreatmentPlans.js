import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconPlus from '../../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../../utils/localization';
import TreatmentPlan from './TreatmentPlan';

const TreatmentPlans = ({ patient }) => {
  return (
    <div className='patients-root__treatment-plans'>
      <div className='patients-root__treatment-plans__plans-data'>
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
      <div className='patients-root__treatment-plans__actions'>
        <Button className='btn-outline-primary' variant='outline-primary'>
          {textForKey('Add plan')}
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

export default TreatmentPlans;

TreatmentPlans.propTypes = {
  patient: PropTypes.object,
};
