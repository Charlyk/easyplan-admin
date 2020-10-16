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
import {
  changeSelectedClinic,
  setAppointmentModal,
  setCreateClinic,
  triggerUserLogout,
} from '../../redux/actions/actions';
import { appointmentModalSelector } from '../../redux/selectors/modalsSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import paths from '../../utils/paths';
import authManager from '../../utils/settings/authManager';
import Calendar from '../Calendar';
import Categories from '../Categories';
import Patients from '../Patients';
import Settings from '../Settings';
import Statistics from '../Statistics';
import Users from '../Users';

const reducerTypes = {
  setCurrentPath: 'setCurrentPath',
};

const reducerActions = {
  setCurrentPath: payload => ({ type: reducerTypes.setCurrentPath, payload }),
};

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
      localDispatch(reducerActions.setCurrentPath(location.pathname));
    } else {
      history.push('/login');
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
    return <Redirect to='/login' />;
  }

  if (currentPath === '/') {
    if (['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic)) {
      return <Redirect to='/analytics/general' />;
    } else if (selectedClinic?.roleInClinic === 'RECEPTION') {
      return <Redirect to='/calendar' />;
    }
  }

  return (
    <div className='main-page' id='main-page'>
      <AddAppointmentModal
        onClose={handleAppointmentModalClose}
        schedule={appointmentModal?.schedule}
        open={appointmentModal?.open}
        doctor={appointmentModal?.doctor}
        date={appointmentModal?.date}
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
              <Route path='/categories' component={Categories} />
              <Route path='/users' component={Users} />
              <Route path='/calendar' component={Calendar} />
              <Route path='/patients' component={Patients} />
              <Route path='/settings' component={Settings} />
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
