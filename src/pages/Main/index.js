import React, { useEffect, useReducer } from 'react';

import styles from './Main.module.scss';

import { usePubNub } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useHistory,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AddAppointmentModal from '../../components/AddAppintmentModal';
import DataMigrationModal from '../../components/DataMigrationModal';
import MainMenu from '../../components/MainMenu';
import PageHeader from '../../components/PageHeader';
import PatientDetailsModal from '../../components/PatientDetailsModal';
import ServiceDetailsModal from '../../components/ServiceDetailsModal';
import {
  changeSelectedClinic,
  setAppointmentModal,
  setCreateClinic,
  setPatientDetails,
  toggleImportModal,
  triggerUserLogout,
} from '../../redux/actions/actions';
import { appointmentModalSelector } from '../../redux/selectors/modalsSelector';
import {
  isImportModalOpenSelector,
  patientDetailsSelector,
  userSelector,
} from '../../redux/selectors/rootSelector';
import { generateReducerActions, updateLink } from '../../utils/helperFuncs';
import paths from '../../utils/paths';
import authManager from '../../utils/settings/authManager';
import sessionManager from '../../utils/settings/sessionManager';
import Calendar from '../Calendar';
import NewPatients from '../NewPatients';
import Services from '../Services';
import Settings from '../Settings';
import SMSMessages from '../SMSMessages';
import Statistics from '../Statistics';
import Users from '../Users';

const reducerTypes = {
  setCurrentPath: 'setCurrentPath',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setCurrentPath:
      return { ...state, currentPath: action.payload };
    default:
      return state;
  }
};

const Main = () => {
  const pubnub = usePubNub();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);
  const appointmentModal = useSelector(appointmentModalSelector);
  const isImportModalOpen = useSelector(isImportModalOpenSelector);
  const patientDetails = useSelector(patientDetailsSelector);
  const [{ currentPath }, localDispatch] = useReducer(reducer, {
    currentPath: location.pathname,
    openAppointmentModal: false,
  });
  const selectedClinic = currentUser?.clinics?.find(
    item => item.clinicId === sessionManager.getSelectedClinicId(),
  );

  useEffect(() => {
    if (currentUser != null) {
      pubnub.setUUID(currentUser.id);
    }
  }, [currentUser]);

  const getPageTitle = () => {
    return paths[currentPath];
  };

  useEffect(() => {
    if (authManager.isLoggedIn()) {
      localDispatch(actions.setCurrentPath(location.pathname));
    } else {
      history.push(updateLink('/login'));
    }
  }, [location]);

  const handleStartLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  const handleCreateClinic = () => {
    dispatch(setCreateClinic({ open: true, canClose: true }));
  };

  const handleChangeCompany = company => {
    dispatch(changeSelectedClinic(company.clinicId));
  };

  const handleAppointmentModalClose = () => {
    dispatch(setAppointmentModal({ open: false }));
  };

  const handleClosePatientDetails = () => {
    dispatch(
      setPatientDetails({ show: false, patientId: null, onDelete: () => null }),
    );
  };

  const handleCloseImportModal = () => {
    dispatch(toggleImportModal());
  };

  if (!authManager.isLoggedIn()) {
    return <Redirect to={updateLink('/login')} />;
  }

  if (currentPath === '/') {
    if (['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic)) {
      return <Redirect to={updateLink('/analytics/general')} />;
    } else if (selectedClinic?.roleInClinic === 'RECEPTION') {
      return <Redirect to={updateLink('/calendar')} />;
    }
  }

  return (
    <div className={styles['main-page']} id='main-page'>
      <ServiceDetailsModal />
      {patientDetails.patientId != null && (
        <PatientDetailsModal
          {...patientDetails}
          onClose={handleClosePatientDetails}
        />
      )}
      {isImportModalOpen && (
        <DataMigrationModal
          show={isImportModalOpen}
          onClose={handleCloseImportModal}
        />
      )}
      {appointmentModal?.open && (
        <AddAppointmentModal
          onClose={handleAppointmentModalClose}
          schedule={appointmentModal?.schedule}
          open={appointmentModal?.open}
          doctor={appointmentModal?.doctor}
          date={appointmentModal?.date}
          patient={appointmentModal?.patient}
          startHour={appointmentModal?.startHour}
          endHour={appointmentModal?.endHour}
        />
      )}
      {currentUser != null && (
        <MainMenu
          currentUser={currentUser}
          currentPath={currentPath}
          onCreateClinic={handleCreateClinic}
          onChangeCompany={handleChangeCompany}
        />
      )}
      {currentUser != null && selectedClinic != null && (
        <div className={styles['data-container']}>
          <PageHeader
            title={getPageTitle()}
            user={currentUser}
            onLogout={handleStartLogout}
          />
          <div className={styles.data}>
            <Switch>
              <Route path='/analytics' component={Statistics} />
              <Route path='/categories' component={Services} />
              <Route path='/users' component={Users} />
              <Route path='/calendar' component={Calendar} />
              <Route path='/patients' component={NewPatients} />
              <Route path='/messages' component={SMSMessages} />
              <Route path='/settings' component={Settings} />
            </Switch>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
