import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import styles from './PatientTreatmentPlan.module.scss';
import reducer, {
  initialState,
  setInitialData,
} from './PatientTreatmentPlan.reducer';

const TeethContainer = dynamic(() => import('./TeethContainer'));
const ServicesWrapper = dynamic(() => import('./ServicesWrapper'));

const PatientTreatmentPlan = ({
  scheduleData: treatmentPlan,
  servicesClasses,
  readOnly,
}) => {
  const [{ toothServices, allServices }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (treatmentPlan == null) return;
    localDispatch(setInitialData(treatmentPlan));
  }, [treatmentPlan]);

  return (
    <div className={styles.patientTreatmentPlan}>
      <TeethContainer readOnly={readOnly} toothServices={toothServices} />
      <ServicesWrapper
        allServices={allServices}
        paperClasses={servicesClasses}
      />
    </div>
  );
};

export default PatientTreatmentPlan;

PatientTreatmentPlan.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentClinic: PropTypes.object.isRequired,
  servicesClasses: PropTypes.any,
  onFinalize: PropTypes.func,
  readOnly: PropTypes.bool,
};

PatientTreatmentPlan.defaultProps = {
  readOnly: false,
};
