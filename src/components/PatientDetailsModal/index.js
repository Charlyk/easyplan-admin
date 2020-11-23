import React, { useEffect, useReducer } from 'react';

import { Box, Typography, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Modal, ListGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import IconAvatar from '../../assets/icons/iconAvatar';
import IconClose from '../../assets/icons/iconClose';
import {
  setPatientNoteModal,
  setPatientXRayModal,
  togglePatientsListUpdate,
} from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import AppointmentNotes from './comps/appointmentNotes';
import PatientAppointments from './comps/appointments/PatientAppointments';
import PatientNotes from './comps/notes/PatientNotes';
import PatientDebtsList from './comps/PatientDebtsList';
import PatientPersonalData from './comps/PatientPersonalData';
import OrthodonticPlan from './comps/treatment-plans/OrthodonticPlan';
import PatientXRay from './comps/x-ray/PatientXRay';
import './styles.scss';

const MenuItem = {
  personalInfo: 'personal-info',
  notes: 'notes',
  appointments: 'appointments',
  xRay: 'x-ray',
  treatmentPlan: 'treatmentPlan',
  orthodonticPlan: 'orthodonticPlan',
  delete: 'delete',
  debts: 'debts',
};

const initialState = {
  currentMenu: MenuItem.personalInfo,
  isFetching: false,
  patient: null,
};

const reducerTypes = {
  setCurrentMenu: 'setCurrentMenu',
  setIsFetching: 'setIsFetching',
  setPatient: 'setPatient',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setCurrentMenu:
      return { ...state, currentMenu: action.payload };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setPatient:
      return { ...state, patient: action.payload };
    default:
      return state;
  }
};

const PatientDetailsModal = ({ show, patientId, onClose, onDelete }) => {
  const dispatch = useDispatch();
  const [{ currentMenu, isFetching, patient }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (!show) {
      localDispatch(actions.setCurrentMenu(MenuItem.personalInfo));
    }
  }, [show]);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async (updateList = false) => {
    if (patientId == null) return;
    localDispatch(actions.setIsFetching(true));
    const response = await dataAPI.fetchPatientDetails(patientId);
    if (response.isError) {
      console.error(response.message);
    } else {
      localDispatch(actions.setPatient(response.data));
    }
    localDispatch(actions.setIsFetching(false));
    if (updateList) {
      dispatch(togglePatientsListUpdate());
    }
  };

  const handleAddNote = () => {
    dispatch(setPatientNoteModal({ open: true, patientId, mode: 'notes' }));
  };

  const handleStartDeletePatient = () => {
    if (typeof onDelete === 'function') {
      onDelete(patient);
    }
  };

  const handleMenuClick = event => {
    const targetId = event.target.id;
    if (targetId !== MenuItem.delete) {
      localDispatch(actions.setCurrentMenu(targetId));
    } else {
      handleStartDeletePatient();
    }
  };

  const menuItemClasses = itemId => {
    return currentMenu === itemId ? 'selected' : '';
  };

  const handleAddXRayImages = () => {
    dispatch(setPatientXRayModal({ open: true, patientId: patient.id }));
  };

  return (
    <Modal
      centered
      show={show}
      size='xl'
      onHide={onClose}
      className='patient-details-modal'
    >
      <Modal.Body>
        {isFetching && <CircularProgress />}
        <div
          role='button'
          tabIndex={0}
          className='close-button'
          onClick={onClose}
        >
          <IconClose />
        </div>
        {patient != null && (
          <Box display='flex' position='relative' height='100%'>
            <div className='patient-menu-container'>
              <div className='name-and-avatar'>
                <div className='avatar-wrapper'>
                  <IconAvatar />
                </div>
                <Typography classes={{ root: 'name-label' }}>
                  {patient?.fullName}
                </Typography>
              </div>
              <Box mt='1rem' mb='1rem' className='menu-wrapper'>
                <ListGroup>
                  <ListGroup.Item
                    action
                    id={MenuItem.personalInfo}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.personalInfo)}
                  >
                    {textForKey('Personal info')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.debts}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.debts)}
                  >
                    {textForKey('Debts')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.notes}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.notes)}
                  >
                    {textForKey('Notes')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.appointments}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.appointments)}
                  >
                    {textForKey('Appointments')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.xRay}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.xRay)}
                  >
                    {textForKey('X-Ray')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.treatmentPlan}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.treatmentPlan)}
                  >
                    {textForKey('Appointments notes')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.orthodonticPlan}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.orthodonticPlan)}
                  >
                    {textForKey('Orthodontic plan')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    variant='danger'
                    id={MenuItem.delete}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.delete)}
                  >
                    {textForKey('Delete')}
                  </ListGroup.Item>
                </ListGroup>
              </Box>
            </div>
            <div className='patient-details-container'>
              {currentMenu === MenuItem.personalInfo && (
                <PatientPersonalData
                  patient={patient}
                  onPatientUpdated={fetchPatientDetails}
                />
              )}
              {currentMenu === MenuItem.notes && (
                <PatientNotes patient={patient} onAddNote={handleAddNote} />
              )}
              {currentMenu === MenuItem.appointments && (
                <PatientAppointments patient={patient} />
              )}
              {currentMenu === MenuItem.xRay && (
                <PatientXRay
                  patient={patient}
                  onAddXRay={handleAddXRayImages}
                />
              )}
              {currentMenu === MenuItem.treatmentPlan && (
                <AppointmentNotes patient={patient} />
              )}
              {currentMenu === MenuItem.orthodonticPlan && (
                <OrthodonticPlan patient={patient} />
              )}
              {currentMenu === MenuItem.debts && (
                <PatientDebtsList patient={patient} />
              )}
            </div>
          </Box>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PatientDetailsModal;

PatientDetailsModal.propTypes = {
  patientId: PropTypes.string.isRequired,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

PatientDetailsModal.defaultProps = {
  onClose: () => null,
  onDelete: () => null,
};
