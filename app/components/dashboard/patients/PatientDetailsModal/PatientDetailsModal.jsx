import React, { useEffect, useReducer } from 'react';
import clsx from "clsx";
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import MenuList from '@material-ui/core/MenuList';
import MuiMenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../../icons/iconAvatar';
import IconClose from '../../../icons/iconClose';
import {
  setPatientNoteModal,
  setPatientXRayModal,
  togglePatientsListUpdate,
} from '../../../../../redux/actions/actions';
import { setAddPaymentModal } from '../../../../../redux/actions/addPaymentModalActions';
import { getPatientDetails } from "../../../../../middleware/api/patients";
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
import PatientTreatmentPlanContainer from "./PatientTreatmentPlanContainer";
import PatientPhoneRecords from "./PatientPhoneRecords";
import {
  reducer,
  initialState,
  actions,
  MenuItem, MenuItems
} from './PatientDetailsModal.reducer';
import styles from './PatientDetailsModal.module.scss';
import IconButton from "@material-ui/core/IconButton";

const PatientDetailsModal = (
  {
    show,
    currentUser,
    currentClinic,
    patientId,
    menuItem,
    authToken,
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
      const { data: patient } = response;
      localDispatch(actions.setPatient(patient));
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

  const handleMenuClick = (menuItem) => {
    const targetId = menuItem.id;
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

  const stopPropagation = event => {
    event.stopPropagation();
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
            authToken={authToken}
            currentUser={currentUser}
            currentClinic={currentClinic}
            patientId={patient.id}
          />
        )
      case MenuItem.phoneRecords:
        return <PatientPhoneRecords patient={patient} />
    }
  };

  return (
    <Modal
      disablePortal
      open={show}
      onClose={onClose}
      onBackdropClick={onClose}
      className={styles.patientDetailsModal}
    >
      <Paper className={styles.modalPaper}>
        <div className={styles.dataContainer}>
          <IconButton
            role='button'
            tabIndex={0}
            className={styles.closeButton}
            onPointerUp={onClose}
          >
            <IconClose/>
          </IconButton>
          {patient != null && (
            <div className={styles.menuContainer}>
              <div className={styles.nameAndAvatar}>
                <div className={styles.avatarWrapper}>
                  <IconAvatar/>
                </div>
                <Typography classes={{ root: styles.nameLabel }}>
                  {patient?.fullName}
                </Typography>
                <Typography classes={{ root: clsx(styles.phoneLabel, styles.phone) }}>
                  <a
                    href={`tel:${patient.countryCode}${patient.phoneNumber}`}
                    onClick={stopPropagation}
                  >
                    {`+${patient.countryCode}${patient.phoneNumber}`}
                  </a>
                </Typography>
              </div>
              <MenuList className={styles.menuList}>
                {MenuItems.map((item) => (
                  <MuiMenuItem
                    key={item.id}
                    selected={currentMenu === item.id}
                    onPointerUp={() => handleMenuClick(item)}
                    classes={{
                      root: clsx(styles.menuItem, styles[item.type]),
                      selected: styles.selectedItem,
                    }}
                  >
                    {item.name}
                  </MuiMenuItem>
                ))}
              </MenuList>
            </div>
          )}
          {patient != null && (
            <div className={styles.patientDetailsContainer}>{menuContent()}</div>
          )}
        </div>
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar'/>
          </div>
        )}
      </Paper>
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
