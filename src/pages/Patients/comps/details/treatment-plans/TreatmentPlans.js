import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';

import dataAPI from '../../../../../utils/api/dataAPI';
import { textForKey } from '../../../../../utils/localization';

const TreatmentPlans = ({ patient }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetchTreatmentPlan();
  }, [patient]);

  const fetchTreatmentPlan = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchTreatmentPlan(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setPlan(response.data);
    }
    setIsLoading(false);
  };

  return (
    <div className='patient-treatment-plans'>
      {isLoading && <Spinner animation='border' className='loading-spinner' />}
      {!isLoading && !plan && (
        <span className='no-data-label'>{textForKey('No treatment plan')}</span>
      )}
      {plan && (
        <React.Fragment>
          <span className='group-title'>{textForKey('Diagnosis')}</span>
          <div className='options-row'>
            <span className='group-subtitle'>{textForKey('Class')}</span>
            <div className='options-container'>
              <div
                role='button'
                tabIndex={0}
                className='option-button selected'
              >
                <span className='option-text'>{plan.planClass}</span>
              </div>
            </div>
          </div>
          <div className='options-row'>
            <span className='group-subtitle'>{textForKey('Occlusion')}</span>
            <div className='options-container'>
              <div
                role='button'
                tabIndex={0}
                className='option-button selected'
              >
                <span className='option-text'>{plan.occlusion}</span>
              </div>
            </div>
          </div>
          <div className='options-row'>
            <span className='group-subtitle'>{textForKey('Included')}</span>
            <div className='options-container'>
              <div
                role='button'
                tabIndex={0}
                className='option-button selected'
              >
                <span className='option-text'>{plan.included}</span>
              </div>
            </div>
          </div>
          <div className='options-row'>
            <span className='group-title'>{textForKey('Radiografie')}</span>
            <div className='options-container'>
              <div
                role='button'
                tabIndex={0}
                className='option-button selected'
              >
                <span className='option-text'>{plan.radiograph}</span>
              </div>
            </div>
          </div>
          <div className='options-row'>
            <span className='group-title'>{textForKey('Treatment plan')}</span>
            <div className='options-container'>
              {plan.services.map(item => (
                <div
                  key={item.id}
                  role='button'
                  tabIndex={0}
                  className='option-button selected'
                >
                  <span className='option-text'>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='options-row'>
            <span className='group-title'>{textForKey('Fallen brackets')}</span>
            <div className='options-container'>
              {plan.fallenBrackets.map(item => (
                <div
                  key={item}
                  role='button'
                  tabIndex={0}
                  className='option-button selected'
                >
                  <span className='option-text'>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default TreatmentPlans;

TreatmentPlans.propTypes = {
  patient: PropTypes.object,
};
