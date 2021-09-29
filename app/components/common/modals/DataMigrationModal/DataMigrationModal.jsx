import React, { useEffect, useReducer } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styles from './DataMigrationModal.module.scss';
import { usePubNub } from 'pubnub-react';
import Modal from 'react-bootstrap/Modal';

import IconClose from '../../../icons/iconClose';
import { env } from '../../../../utils/constants';
import generateReducerActions from '../../../../../utils/generateReducerActions';
import { textForKey } from '../../../../../utils/localization';
import AuthenticationStep from './AuthenticationStep';
import DataMigrationFinalStep from './DataMigrationFinalStep';
import ImportSelectionStep from './ImportSelectionStep';

const steps = [
  textForKey('Authentication'),
  textForKey('Import data'),
  textForKey('Finish'),
];

const initialState = {
  activeStep: 0,
  completedSteps: [],
  yClientsUser: null,
  dataTypes: [],
  company: null,
  startDate: moment().subtract(1, 'month').toDate(),
  endDate: moment().toDate(),
};

const reducerTypes = {
  setActiveStep: 'setActiveStep',
  setCompletedSteps: 'setCompletedSteps',
  setYClientsUser: 'setYClientsUser',
  setDataTypes: 'setDataTypes',
  resetState: 'resetState',
  setCompany: 'setCompany',
  setImportDetails: 'setImportDetails',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setActiveStep:
      return { ...state, activeStep: action.payload };
    case reducerTypes.setCompletedSteps:
      return { ...state, completedSteps: action.payload };
    case reducerTypes.setYClientsUser: {
      const newCompletedSteps = cloneDeep(state.completedSteps);
      if (action.payload == null) {
        remove(newCompletedSteps, (item) => item === 0);
      } else {
        newCompletedSteps.push(0);
      }
      return {
        ...state,
        yClientsUser: action.payload,
        activeStep: action.payload == null ? 0 : 1,
        completedSteps: newCompletedSteps,
      };
    }
    case reducerTypes.setDataTypes: {
      const newCompletedSteps = cloneDeep(state.completedSteps);
      if (action.payload == null) {
        remove(newCompletedSteps, (item) => item === 1);
      } else {
        newCompletedSteps.push(1);
      }
      return {
        ...state,
        dataTypes: action.payload,
        completedSteps: newCompletedSteps,
        activeStep: action.payload == null ? 1 : 2,
      };
    }
    case reducerTypes.resetState:
      return initialState;
    case reducerTypes.setCompany:
      return { ...state, company: action.payload };
    case reducerTypes.setImportDetails: {
      const { dataTypes, company, startDate, endDate } = action.payload;
      const isValidData = dataTypes.length !== 0 && company != null;
      const newCompletedSteps = cloneDeep(state.completedSteps);
      if (isValidData) {
        newCompletedSteps.push(1);
      }
      return {
        ...state,
        ...action.payload,
        completedSteps: newCompletedSteps,
        activeStep: isValidData ? 2 : 1,
        startDate,
        endDate,
      };
    }
    default:
      return state;
  }
};

const DataMigrationModal = ({ show, currentClinic, authToken, onClose }) => {
  const pubnub = usePubNub();
  const [
    {
      activeStep,
      completedSteps,
      yClientsUser,
      dataTypes,
      company,
      startDate,
      endDate,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!show) {
      localDispatch(actions.resetState());
    }
  }, [show]);

  const handleUserAuthenticatedWithYClients = (userData) => {
    localDispatch(actions.setYClientsUser(userData));
  };

  const handleDataTypesSelected = (newTypes, company, startDate, endDate) => {
    localDispatch(
      actions.setImportDetails({
        dataTypes: newTypes,
        company,
        startDate,
        endDate,
      }),
    );
  };

  const handleStartMigration = () => {
    const isDataValid =
      dataTypes.length > 0 && yClientsUser != null && company != null;
    if (!isDataValid) return;
    const environment = env === '' ? 'prod' : env;
    const message = {
      user: yClientsUser,
      dataTypes,
      company,
      clinicId: currentClinic.id,
      authToken: authToken,
      startDate,
      endDate,
    };
    pubnub.publish({
      channel: `${environment}-migrate-data-from-another-app-channel`,
      message,
    });
    handleModalClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AuthenticationStep onLogin={handleUserAuthenticatedWithYClients} />
        );
      case 1:
        return (
          <ImportSelectionStep
            onImport={handleDataTypesSelected}
            userData={yClientsUser}
          />
        );
      case 2:
        return <DataMigrationFinalStep onStart={handleStartMigration} />;
    }
  };

  const handleModalClose = () => {
    setTimeout(() => {
      localDispatch(actions.resetState());
    }, 300);
    onClose();
  };

  const isStepCompleted = (step) => {
    return completedSteps.includes(step);
  };

  return (
    <Modal
      className={styles['data-migration-modal-root']}
      centered
      show={show}
      size='xl'
      onHide={handleModalClose}
    >
      <Modal.Header>
        <Typography classes={{ root: styles['modal-title-label'] }}>
          {textForKey('Migrate data from Yclients')}
        </Typography>
        <div
          role='button'
          tabIndex={0}
          onClick={onClose}
          className='close-button'
        >
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
  onClose: PropTypes.func,
};

DataMigrationModal.defaultProps = {
  onClose: () => null,
};
