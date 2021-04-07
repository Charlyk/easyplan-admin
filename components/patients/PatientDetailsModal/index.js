import React, { useEffect, useReducer } from 'react';

import { Box, Typography, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Modal, ListGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../icons/iconAvatar';
import IconClose from '../../icons/iconClose';
import {
  setPatientNoteModal,
  setPatientXRayModal,
  togglePatientsListUpdate,
} from '../../../redux/actions/actions';
import { setAddPaymentModal } from '../../../redux/actions/addPaymentModalActions';
import { generateReducerActions } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import AppointmentNotes from './AppointmentNotes';
import PatientAppointments from './PatientAppointments';
import PatientHistory from './PatientHistory';
import PatientMessages from './PatientMessages';
import PatientNotes from './PatientNotes';
import PatientDebtsList from './PatientDebtsList';
import PatientPersonalData from './PatientPersonalData';
import PatientPurchasesList from './PatientPurchasesList';
import OrthodonticPlan from './OrthodonticPlan';
import PatientXRay from './PatientXRay';
import { getPatientDetails } from "../../../middleware/api/patients";
import styles from '../../../styles/PatientDetailsModal.module.scss';
import PatientTreatmentPlan from "../../doctors/PatientTreatmentPlan";
import PatientTreatmentPlanContainer from "./PatientTreatmentPlanContainer";

const MenuItem = {
  personalInfo: 'personal-info',
  notes: 'notes',
  appointments: 'appointments',
  xRay: 'x-ray',
  treatmentPlan: 'treatmentPlan',
  orthodonticPlan: 'orthodonticPlan',
  generalTreatmentPlan: 'generalTreatmentPlan',
  delete: 'delete',
  debts: 'debts',
  purchases: 'purchases',
  addPayment: 'addPayment',
  messages: 'messages',
  history: 'history',
};

const initialState = {
  currentMenu: MenuItem.personalInfo,
  isFetching: false,
  patient: null,
  viewInvoice: null,
};

const reducerTypes = {
  setCurrentMenu: 'setCurrentMenu',
  setIsFetching: 'setIsFetching',
  setPatient: 'setPatient',
  setViewInvoice: 'setViewInvoice',
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
    case reducerTypes.setViewInvoice:
      if (action.payload != null) {
        return {
          ...state,
          viewInvoice: action.payload,
          currentMenu: MenuItem.debts,
        };
      } else {
        return { ...state, viewInvoice: action.payload };
      }
    default:
      return state;
  }
};

const PatientDetailsModal = (
  {
    show,
    currentUser,
    currentClinic,
    patientId,
    menuItem,
    onClose,
    onDelete,
  }
) => {
  const dispatch = useDispatch();
  const [
    { currentMenu, isFetching, patient, viewInvoice },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!show) {
      localDispatch(actions.setCurrentMenu(MenuItem.personalInfo));
    }
  }, [show]);

  useEffect(() => {
    if (menuItem != null) {
      localDispatch(actions.setCurrentMenu(menuItem));
    }
  }, [menuItem]);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async (updateList = false) => {
    if (patientId == null) return;
    localDispatch(actions.setIsFetching(true));
    try {
      const response = await getPatientDetails(patientId);
      localDispatch(actions.setPatient(response.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsFetching(false));
      if (updateList) {
        dispatch(togglePatientsListUpdate(true));
      }
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

  const handleMenuClick = (event) => {
    const targetId = event.target.id;
    if (targetId === MenuItem.delete) {
      handleStartDeletePatient();
    } else if (targetId === MenuItem.addPayment) {
      dispatch(setAddPaymentModal({ open: true, patient }));
    } else {
      localDispatch(actions.setCurrentMenu(targetId));
    }
  };

  const handleDebtViewed = () => {
    localDispatch(actions.setViewInvoice(null));
  };

  const menuItemClasses = (itemId) => {
    return currentMenu === itemId ? styles.selected : '';
  };

  const handleAddXRayImages = () => {
    dispatch(setPatientXRayModal({ open: true, patientId: patient.id }));
  };

  const menuContent = () => {
    switch (currentMenu) {
      case MenuItem.personalInfo:
        return (
          <PatientPersonalData
            patient={patient}
            onPatientUpdated={fetchPatientDetails}
          />
        );
      case MenuItem.notes:
        return <PatientNotes patient={patient} onAddNote={handleAddNote}/>;
      case MenuItem.appointments:
        return <PatientAppointments patient={patient}/>;
      case MenuItem.xRay:
        return (
          <PatientXRay patient={patient} onAddXRay={handleAddXRayImages}/>
        );
      case MenuItem.treatmentPlan:
        return <AppointmentNotes currentUser={currentUser} patient={patient}/>;
      case MenuItem.orthodonticPlan:
        return (
          <OrthodonticPlan
            currentClinic={currentClinic}
            currentUser={currentUser}
            patient={patient}
          />
        );
      case MenuItem.debts:
        return (
          <PatientDebtsList
            patient={patient}
            viewInvoice={viewInvoice}
            onDebtShowed={handleDebtViewed}
          />
        );
      case MenuItem.purchases:
        return <PatientPurchasesList currentClinic={currentClinic} patient={patient}/>;
      case MenuItem.messages:
        return <PatientMessages patient={patient}/>;
      case MenuItem.history:
        return <PatientHistory clinic={currentClinic} patient={patient}/>;
      case MenuItem.generalTreatmentPlan:
        return (
          <PatientTreatmentPlanContainer
            currentUser={currentUser}
            currentClinic={currentClinic}
            patientId={patient.id}
          />
        )
    }
  };

  return (
    <Modal
      centered
      show={show}
      size='xl'
      onHide={onClose}
      className={styles['patient-details-modal']}
    >
      <Modal.Body>
        {isFetching && <CircularProgress/>}
        <div
          role='button'
          tabIndex={0}
          className={styles['close-button']}
          onClick={onClose}
        >
          <IconClose/>
        </div>
        {patient != null && (
          <Box display='flex' position='relative' height='100%'>
            <div className={styles['patient-menu-container']}>
              <div className={styles['name-and-avatar']}>
                <div className={styles['avatar-wrapper']}>
                  <IconAvatar/>
                </div>
                <Typography classes={{ root: styles['name-label'] }}>
                  {patient?.fullName}
                </Typography>
              </div>
              <Box mt='1rem' mb='1rem' className={styles['menu-wrapper']}>
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
                    id={MenuItem.purchases}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.purchases)}
                  >
                    {textForKey('Payments')}
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
                    id={MenuItem.generalTreatmentPlan}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.generalTreatmentPlan)}
                  >
                    {textForKey('Treatment plan')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.messages}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.messages)}
                  >
                    {textForKey('Messages')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    id={MenuItem.history}
                    onClick={handleMenuClick}
                    className={menuItemClasses(MenuItem.history)}
                  >
                    {textForKey('History of changes')}
                  </ListGroup.Item>
                  {typeof onDelete === 'function' && (
                    <ListGroup.Item
                      action
                      variant='danger'
                      id={MenuItem.delete}
                      onClick={handleMenuClick}
                      className={menuItemClasses(MenuItem.delete)}
                    >
                      {textForKey('Delete')}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Box>
            </div>
            <div className={styles['patient-details-container']}>{menuContent()}</div>
          </Box>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PatientDetailsModal;

PatientDetailsModal.propTypes = {
  currentUser: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

PatientDetailsModal.defaultProps = {
  onClose: () => null,
  onDelete: () => null,
};
