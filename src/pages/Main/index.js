import React, { useEffect, useReducer } from 'react';

import './styles.scss';

import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useHistory,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AddAppointmentModal from '../../components/AddAppintmentModal';
import MainMenu from '../../components/MainMenu';
import PageHeader from '../../components/PageHeader';
import ServiceDetailsModal from '../../components/ServiceDetailsModal';
import {
  changeSelectedClinic,
  setAppointmentModal,
  setCreateClinic,
  triggerUserLogout,
} from '../../redux/actions/actions';
import { appointmentModalSelector } from '../../redux/selectors/modalsSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import { generateReducerActions, updateLink } from '../../utils/helperFuncs';
import paths from '../../utils/paths';
import authManager from '../../utils/settings/authManager';
import Calendar from '../Calendar';
import NewPatients from '../NewPatients';
import Services from '../Services';
import Settings from '../Settings';
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
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const appointmentModal = useSelector(appointmentModalSelector);
  const [{ currentPath }, localDispatch] = useReducer(reducer, {
    currentPath: location.pathname,
    openAppointmentModal: false,
  });
  const selectedClinic = user?.clinics?.find(
    item => item.id === user.selectedClinic,
  );

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
    dispatch(changeSelectedClinic(company.id));
  };

  const handleAppointmentModalClose = () => {
    dispatch(setAppointmentModal({ open: false }));
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
    <div className='main-page' id='main-page'>
      <ServiceDetailsModal />
      <AddAppointmentModal
        onClose={handleAppointmentModalClose}
        schedule={appointmentModal?.schedule}
        open={appointmentModal?.open}
        doctor={appointmentModal?.doctor}
        date={appointmentModal?.date}
        patient={appointmentModal?.patient}
      />
      {user != null && (
        <MainMenu
          currentUser={user}
          currentPath={currentPath}
          onCreateClinic={handleCreateClinic}
          onChangeCompany={handleChangeCompany}
        />
      )}
      <div className='data-container'>
        {user != null && selectedClinic != null && (
          <PageHeader
            title={getPageTitle()}
            user={user}
            onLogout={handleStartLogout}
          />
        )}
        {user != null && selectedClinic != null && (
          <div className='data'>
            <Switch>
              <Route path='/analytics' component={Statistics} />
              <Route path='/categories' component={Services} />
              <Route path='/users' component={Users} />
              <Route path='/calendar' component={Calendar} />
              <Route path='/patients' component={NewPatients} />
              <Route path='/settings' component={Settings} />
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
