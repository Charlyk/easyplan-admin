import React, { useEffect, useState } from 'react';

import './styles.scss';

import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useHistory,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import ConfirmationModal from '../../components/ConfirmationModal';
import CreateClinicModal from '../../components/CreateClinicModal';
import MainMenu from '../../components/MainMenu';
import PageHeader from '../../components/PageHeader';
import {
  setCurrentUser,
  triggerUpdateCurrentUser,
} from '../../redux/actions/actions';
import { userSelector } from '../../redux/selectors/rootSelector';
import authAPI from '../../utils/api/authAPI';
import { textForKey } from '../../utils/localization';
import paths from '../../utils/paths';
import authManager from '../../utils/settings/authManager';
import Calendar from '../Calendar';
import Categories from '../Categories';
import Patients from '../Patients';
import Settings from '../Settings';
import Statistics from '../Statistics';
import Users from '../Users';

const Main = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreatingClinic, setIsCreatingClinic] = useState({
    open: false,
    canClose: false,
  });
  const selectedClinic = user?.clinics?.find(
    item => item.id === user.selectedClinic,
  );

  const getPageTitle = () => {
    return paths[currentPath];
  };

  useEffect(() => {
    if (authManager.isLoggedIn()) {
      setCurrentPath(location.pathname);
    } else {
      history.push('/login');
    }
  }, [location]);

  const handleStartLogout = () => {
    setIsLoggingOut(true);
  };

  const handleCancelLogout = () => {
    setIsLoggingOut(false);
  };

  const handleUserLogout = () => {
    authManager.logOut();
    dispatch(setCurrentUser(null));
  };

  const handleClinicCreated = () => {
    dispatch(triggerUpdateCurrentUser());
    setIsCreatingClinic({ open: false, canClose: false });
  };

  const handleCreateClinic = () => {
    setIsCreatingClinic({ open: true, canClose: true });
  };

  const handleCloseCreateClinic = () => {
    setIsCreatingClinic({ open: false, canClose: false });
  };

  const handleChangeCompany = async company => {
    const response = await authAPI.changeClinic(company.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(setCurrentUser(response.data));
    }
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
      <ConfirmationModal
        title={textForKey('Logout')}
        message={textForKey('logout message')}
        onConfirm={handleUserLogout}
        onClose={handleCancelLogout}
        show={isLoggingOut}
      />
      <CreateClinicModal
        onClose={isCreatingClinic.canClose ? handleCloseCreateClinic : null}
        open={isCreatingClinic.open}
        onCreate={handleClinicCreated}
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
        {user != null && (
          <PageHeader
            title={getPageTitle()}
            user={user}
            onLogout={handleStartLogout}
          />
        )}
        {user != null && (
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
