import React, { useReducer } from 'react';

import PropTypes from 'prop-types';
import './styles.scss';
import { Modal } from 'react-bootstrap';
import { Stepper, Step, StepLabel, Typography } from '@material-ui/core';

import IconClose from '../../assets/icons/iconClose';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import AuthenticationStep from './AuthenticationStep';

const steps = [textForKey('Authentication'), textForKey('Import data')];

const getStepContent = step => {
  switch (step) {
    case 0:
      return <AuthenticationStep />;
    case 1:
      return 'Importing data';
  }
};

const initialState = {
  activeStep: 0,
  completedSteps: [],
};

const reducerTypes = {
  setActiveStep: 'setActiveStep',
  setCompletedSteps: 'setCompletedSteps',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setActiveStep:
      return { ...state, activeStep: action.payload };
    case reducerTypes.setCompletedSteps:
      return { ...state, completedSteps: action.payload };
    default:
      return state;
  }
};

const DataMigrationModal = ({ show }) => {
  const [{ activeStep, completedSteps }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  const handleModalClose = () => {};

  const isStepCompleted = step => {
    return completedSteps.includes(step);
  };

  return (
    <Modal
      className='data-migration-modal-root'
      centered
      show={show}
      size='xl'
      onHide={handleModalClose}
    >
      <Modal.Header>
        <Typography classes={{ root: 'modal-title-label' }}>
          {textForKey('Migrate data from Yclients')}
        </Typography>
        <div className='close-button'>
          <IconClose />
        </div>
      </Modal.Header>
      <Modal.Body>{getStepContent(activeStep)}</Modal.Body>
      <Modal.Footer>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={isStepCompleted(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Modal.Footer>
    </Modal>
  );
};

export default DataMigrationModal;

DataMigrationModal.propTypes = {
  show: PropTypes.bool,
};
