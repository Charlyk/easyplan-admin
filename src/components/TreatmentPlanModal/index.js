import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import PropTypes from 'prop-types';

import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const diagnosisClass = ['1', '2', '3'];
const diagnosisOcclusion = [
  'Inverse',
  'Anterior',
  'Posterior',
  'Deep',
  'Open',
  'Normal',
  'General',
  'Space',
  'Crowding',
  'Supernumerary',
  'Transposition',
];
const diagnosisIncluded = ['Canin Moral', 'Moral Canin'];
const radiographic = ['Orthopantomogram', 'Cephalometric'];
const fallenBrackets = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const TreatmentPlanModal = ({
  open,
  services,
  treatmentPlan,
  onClose,
  onSave,
}) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedOcclusion, setSelectedOcclusion] = useState(null);
  const [selectedIncluded, setSelectedIncluded] = useState(null);
  const [selectedRadiograph, setSelectedRadiograph] = useState(null);
  const [selectedTreatmentPlan, setSelectedTreatmentPlan] = useState(null);
  const [selectedFallenBrackets, setSelectedFallenBrackets] = useState([]);

  useEffect(() => {
    if (treatmentPlan != null) {
      setSelectedClass(treatmentPlan.planClass);
      setSelectedOcclusion(treatmentPlan.occlusion);
      setSelectedIncluded(treatmentPlan.included);
      setSelectedRadiograph(treatmentPlan.radiograph);
      setSelectedTreatmentPlan(treatmentPlan.service);
      setSelectedFallenBrackets(treatmentPlan.fallenBrackets);
    }
  }, [treatmentPlan]);

  const handleClassChange = newClass => {
    setSelectedClass(newClass);
  };

  const handleOcclusionChange = newOcclusion => {
    setSelectedOcclusion(newOcclusion);
  };

  const handleIncludedChange = newIncluded => {
    setSelectedIncluded(newIncluded);
  };

  const handleRadiographChange = newRadiograph => {
    setSelectedRadiograph(newRadiograph);
  };

  const handleTreatmentPlan = newPlan => {
    setSelectedTreatmentPlan(newPlan);
  };

  const handleFallenBracketsChange = bracket => {
    const newBrackets = cloneDeep(selectedFallenBrackets);
    if (newBrackets.includes(bracket)) {
      remove(newBrackets, item => item === bracket);
    } else {
      newBrackets.push(bracket);
    }
    setSelectedFallenBrackets(newBrackets);
  };

  const handleSavePlan = () => {
    const plan = {
      planClass: selectedClass,
      occlusion: selectedOcclusion,
      included: selectedIncluded,
      radiograph: selectedRadiograph,
      service: selectedTreatmentPlan,
      fallenBrackets: selectedFallenBrackets,
    };
    onSave(plan);
  };

  const isFormValid = () => {
    return (
      selectedClass &&
      selectedOcclusion &&
      selectedIncluded &&
      selectedRadiograph &&
      selectedTreatmentPlan
    );
  };

  return (
    <EasyPlanModal
      className='treatment-plan-modal-root'
      open={open}
      onClose={onClose}
      onPositiveClick={handleSavePlan}
      isPositiveDisabled={!isFormValid()}
      title={textForKey('Treatment plan')}
    >
      <div className='treatment-plan-modal-content'>
        <span className='group-title'>{textForKey('Diagnosis')}</span>
        <div className='options-row'>
          <span className='group-subtitle'>{textForKey('Class')}</span>
          <div className='options-container'>
            {diagnosisClass.map(item => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => handleClassChange(item)}
                className={clsx(
                  'option-button',
                  selectedClass === item && 'selected',
                )}
                key={item}
              >
                <span className='option-text'>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='options-row'>
          <span className='group-subtitle'>{textForKey('Occlusion')}</span>
          <div className='options-container'>
            {diagnosisOcclusion.map(item => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => handleOcclusionChange(item)}
                className={clsx(
                  'option-button',
                  selectedOcclusion === item && 'selected',
                )}
                key={item}
              >
                <span className='option-text'>{textForKey(item)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='options-row'>
          <span className='group-subtitle'>{textForKey('Included')}</span>
          <div className='options-container'>
            {diagnosisIncluded.map(item => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => handleIncludedChange(item)}
                className={clsx(
                  'option-button',
                  selectedIncluded === item && 'selected',
                )}
                key={item}
              >
                <span className='option-text'>{textForKey(item)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='options-row'>
          <span className='group-title'>{textForKey('Radiografie')}</span>
          <div className='options-container'>
            {radiographic.map(item => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => handleRadiographChange(item)}
                className={clsx(
                  'option-button',
                  selectedRadiograph === item && 'selected',
                )}
                key={item}
              >
                <span className='option-text'>{textForKey(item)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='options-row'>
          <span className='group-title'>{textForKey('Treatment plan')}</span>
          <div className='options-container'>
            {services.map(item => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => handleTreatmentPlan(item)}
                className={clsx(
                  'option-button',
                  selectedTreatmentPlan?.id === item.id && 'selected',
                )}
                key={item.id}
              >
                <span className='option-text'>{textForKey(item.name)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='options-row'>
          <span className='group-title'>{textForKey('Fallen brackets')}</span>
          <div className='options-container'>
            {fallenBrackets.map(item => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => handleFallenBracketsChange(item)}
                className={clsx(
                  'option-button',
                  selectedFallenBrackets.includes(item) && 'selected',
                )}
                key={item}
              >
                <span className='option-text'>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EasyPlanModal>
  );
};

export default TreatmentPlanModal;

TreatmentPlanModal.propTypes = {
  open: PropTypes.bool,
  treatmentPlan: PropTypes.shape({
    planClass: PropTypes.string,
    occlusion: PropTypes.string,
    included: PropTypes.string,
    radiograph: PropTypes.string,
    service: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      bracket: PropTypes.bool,
    }),
    fallenBrackets: PropTypes.arrayOf(PropTypes.string),
  }),
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      bracket: PropTypes.bool,
    }),
  ),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

TreatmentPlanModal.defaultProps = {
  onClose: () => null,
  onSave: () => null,
};
