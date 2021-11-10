import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import clsx from "clsx";
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import MenuList from '@material-ui/core/MenuList';
import MuiMenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import {
  setPatientXRayModal,
  togglePatientsListUpdate,
} from '../../../../../redux/actions/actions';
import { setAddPaymentModal } from '../../../../../redux/actions/addPaymentModalActions';
import { getPatientDetails, requestUpdatePatient } from "../../../../../middleware/api/patients";
import onRequestError from "../../../../utils/onRequestError";
import { textForKey } from "../../../../utils/localization";
import urlToLambda from "../../../../utils/urlToLambda";
import { HeaderKeys } from "../../../../utils/constants";
import IconEdit from "../../../icons/iconEdit";
import IconAvatar from '../../../icons/iconAvatar';
import IconClose from '../../../icons/iconClose';
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
import reducer, {
  initialState,
  setAvatarFile,
  setCurrentMenu,
  setViewInvoice,
  setPatient,
  setIsFetching,
  MenuItem,
  MenuItems
} from './PatientDetailsModal.reducer';
import styles from './PatientDetailsModal.module.scss';

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
  const inputRef = useRef(null);
  const imageRef = useRef(null);
  const [
    { currentMenu, isFetching, patient, viewInvoice, avatarFile },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const patientAvatar = avatarFile ?? patient?.avatar;

  const updateImagePreview = useCallback((reader) => {
    if (imageRef.current != null) {
      imageRef.current.src = reader.target.result;
    }
  }, [imageRef.current]);

  useEffect(() => {
    if (patientAvatar == null) {
      return;
    }
    if (typeof patientAvatar === 'object') {
      const reader = new FileReader();
      reader.addEventListener('load', updateImagePreview)
      reader.readAsDataURL(avatarFile);
    } else if (typeof patientAvatar === 'string') {
      imageRef.current.crossOrigin = 'anonymous';
      imageRef.current.src = urlToLambda(patientAvatar, 100);
    }
  }, [patientAvatar, updateImagePreview]);

  useEffect(() => {
    if (!show) {
      localDispatch(setCurrentMenu(MenuItem.personalInfo));
    }
  }, [show]);

  useEffect(() => {
    if (menuItem != null) {
      localDispatch(setCurrentMenu(menuItem));
    }
  }, [menuItem]);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const updatePatientPhoto = async (avatarFile) => {
    if (avatarFile == null) {
      return;
    }

    try {
      await requestUpdatePatient(patient.id, patient, avatarFile);
      await fetchPatientDetails(true);
      localDispatch(setAvatarFile(null));
      toast.success(textForKey('Saved successfully'))
    } catch (error) {
      onRequestError(error);
    }
  }

  const fetchPatientDetails = async (updateList = false) => {
    if (patientId == null) return;
    localDispatch(setIsFetching(true));
    try {
      const response = await getPatientDetails(patientId);
      const { data: patient } = response;
      localDispatch(setPatient(patient));
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsFetching(false));
      if (updateList) {
        dispatch(togglePatientsListUpdate(true));
      }
    }
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
      localDispatch(setCurrentMenu(targetId));
    }
  };

  const handleDebtViewed = () => {
    localDispatch(setViewInvoice(null));
  };

  const handleAddXRayImages = () => {
    dispatch(setPatientXRayModal({ open: true, patientId: patient.id }));
  };

  const stopPropagation = event => {
    event.stopPropagation();
  };

  const handleEditAvatar = () => {
    inputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    updatePatientPhoto(file);
    localDispatch(setAvatarFile(file));
  }

  const menuContent = () => {
    switch (currentMenu) {
      case MenuItem.personalInfo:
        return (
          <PatientPersonalData
            patient={patient}
            currentClinic={currentClinic}
            authToken={authToken}
            onPatientUpdated={fetchPatientDetails}
          />
        );
      case MenuItem.notes:
        return <PatientNotes patient={patient}/>;
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
        <input
          ref={inputRef}
          className='custom-file-button'
          type='file'
          name='avatar-file'
          id='avatar-file'
          accept='.jpg,.jpeg,.png'
          onChange={handleAvatarChange}
        />
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
                  <div className={styles.editAvatarWrapper}>
                    <IconButton
                      className={styles.editBtn}
                      onClick={handleEditAvatar}
                    >
                      <IconEdit fill="#3A83DC" />
                    </IconButton>
                  </div>
                  {patientAvatar ? (
                    <img ref={imageRef} alt="Avatar image"/>
                  ) : (
                    <IconAvatar />
                  )}
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
