import React, { useContext, useEffect, useReducer, useRef } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MuiMenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch } from 'react-redux';
import EASImage from 'app/components/common/EASImage';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import IconAvatar from 'app/components/icons/iconAvatar';
import IconClose from 'app/components/icons/iconClose';
import IconEdit from 'app/components/icons/iconEdit';
import NotificationsContext from 'app/context/notificationsContext';
import { HeaderKeys } from 'app/utils/constants';
import useMappedValue from 'app/utils/hooks/useMappedValue';
import onRequestError from 'app/utils/onRequestError';
import {
  getPatientDetails,
  requestUpdatePatient,
} from 'middleware/api/patients';
import { setPatientXRayModal } from 'redux/actions/actions';
import { setAddPaymentModal } from 'redux/actions/addPaymentModalActions';
import { toggleUpdatePatients } from 'redux/slices/mainReduxSlice';
import { requestDeletePatient } from 'redux/slices/patientsListSlice';
import AppointmentNotes from './AppointmentNotes';
import PatientAppointments from './PatientAppointments';
import styles from './PatientDetailsModal.module.scss';
import reducer, {
  initialState,
  setAvatarFile,
  setCurrentMenu,
  setPatient,
  setIsFetching,
  MenuItem,
  MenuItems,
  openDeleteConfirmation,
  closeDeleteConfirmation,
} from './PatientDetailsModal.reducer';
import PatientHistory from './PatientHistory';
import PatientMessages from './PatientMessages';
import PatientNotes from './PatientNotes';
import PatientPersonalData from './PatientPersonalData';
import PatientPhoneRecords from './PatientPhoneRecords';
import PatientPurchasesList from './PatientPurchasesList';
import PatientTreatmentPlanContainer from './PatientTreatmentPlanContainer';
import PatientXRay from './PatientXRay';

const PatientDetailsModal = ({
  show,
  currentUser,
  currentClinic,
  patientId,
  menuItem,
  authToken,
  canDelete,
  onClose,
}) => {
  const textForKey = useTranslate();
  const mappedMenuItems = useMappedValue(MenuItems);
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const inputRef = useRef(null);
  const [
    {
      currentMenu,
      isFetching,
      patient,
      avatarFile,
      showDeleteConfirmation,
      isDeleting,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const patientAvatar = avatarFile ?? patient?.avatar;

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
      await requestUpdatePatient(patient.id, patient, avatarFile, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      await fetchPatientDetails(true);
      localDispatch(setAvatarFile(null));
      toast.success(textForKey('saved successfully'));
    } catch (error) {
      onRequestError(error);
    }
  };

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
        dispatch(toggleUpdatePatients(true));
      }
    }
  };

  const handleStartDeletePatient = () => {
    localDispatch(openDeleteConfirmation());
  };

  const deletePatient = () => {
    dispatch(requestDeletePatient(patient.id));
    onClose?.();
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

  const handleAddXRayImages = () => {
    dispatch(setPatientXRayModal({ open: true, patientId: patient.id }));
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleEditAvatar = () => {
    inputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    updatePatientPhoto(file);
    localDispatch(setAvatarFile(file));
  };

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
        return <PatientNotes patient={patient} />;
      case MenuItem.appointments:
        return <PatientAppointments patient={patient} />;
      case MenuItem.xRay:
        return (
          <PatientXRay patient={patient} onAddXRay={handleAddXRayImages} />
        );
      case MenuItem.treatmentPlan:
        return <AppointmentNotes currentUser={currentUser} patient={patient} />;
      case MenuItem.purchases:
        return <PatientPurchasesList patient={patient} />;
      case MenuItem.messages:
        return <PatientMessages patient={patient} />;
      case MenuItem.history:
        return <PatientHistory clinic={currentClinic} patient={patient} />;
      case MenuItem.generalTreatmentPlan:
        return (
          <PatientTreatmentPlanContainer
            authToken={authToken}
            currentUser={currentUser}
            currentClinic={currentClinic}
            patientId={patient.id}
          />
        );
      case MenuItem.phoneRecords:
        return <PatientPhoneRecords patient={patient} />;
    }
  };

  return (
    <Modal
      disablePortal
      open={show}
      onClose={onClose}
      style={{ zIndex: 1300 }}
      className={styles.patientDetailsModal}
    >
      <Paper className={styles.modalPaper}>
        <ConfirmationModal
          isLoading={isDeleting}
          show={showDeleteConfirmation}
          title={textForKey('delete patient')}
          message={textForKey('delete_patient_message')}
          onConfirm={deletePatient}
          onClose={() => localDispatch(closeDeleteConfirmation())}
        />
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
            <IconClose />
          </IconButton>
          {patient != null && (
            <div className={styles.menuContainer}>
              <div className={styles.nameAndAvatar}>
                <div className={styles.avatarWrapper}>
                  <EASImage
                    enableLoading
                    src={patientAvatar}
                    placeholder={<IconAvatar />}
                    className={styles.avatarRoot}
                  />
                  <div className={styles.editAvatarWrapper}>
                    <IconButton
                      className={styles.editBtn}
                      onClick={handleEditAvatar}
                    >
                      <IconEdit fill='#3A83DC' />
                    </IconButton>
                  </div>
                </div>
                <Typography classes={{ root: styles.nameLabel }}>
                  {patient?.fullName}
                </Typography>
                <Typography
                  classes={{ root: clsx(styles.phoneLabel, styles.phone) }}
                >
                  <a
                    href={`tel:${patient.countryCode}${patient.phoneNumber}`}
                    onClick={stopPropagation}
                  >
                    {`+${patient.countryCode}${patient.phoneNumber}`}
                  </a>
                </Typography>
              </div>
              <MenuList className={styles.menuList}>
                {mappedMenuItems.map((item) => {
                  if (item.id === MenuItem.delete && !canDelete) {
                    return null;
                  }
                  return (
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
                  );
                })}
              </MenuList>
            </div>
          )}
          {patient != null && (
            <div className={styles.patientDetailsContainer}>
              {menuContent()}
            </div>
          )}
        </div>
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
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
