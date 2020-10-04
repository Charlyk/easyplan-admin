import React, { useEffect, useState } from 'react';

import './styles.scss';

import { Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory, Switch, Route } from 'react-router-dom';

import ConfirmationModal from '../../components/ConfirmationModal';
import CreateClinicModal from '../../components/CreateClinicModal';
import MainMenu from '../../components/MainMenu';
import PageHeader from '../../components/PageHeader';
import { setCurrentUser } from '../../redux/actions/actions';
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

const Main = props => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [appIsLoading, setAppIsLoading] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [appRefresh, setAppRefresh] = useState(false);
  const [isCreatingClinic, setIsCreatingClinic] = useState({
    open: false,
    canClose: false,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [props]);

  useEffect(() => {
    if (appRefresh) {
      const selectedClinic = user.clinics.find(
        item => item.id === user.selectedClinic,
      );
      if (['ADMIN', 'MANAGER'].includes(selectedClinic?.roleInClinic)) {
        history.push('/analytics/general');
      } else {
        history.push('/calendar');
      }
    }
  }, [appRefresh]);

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
    setUser(null);
    dispatch(setCurrentUser(null));
    setAppInitialized(false);
    authManager.logOut();
    history.push('/login');
  };

  const handleClinicCreated = () => {
    fetchUser(true);
    setIsCreatingClinic({ open: false, canClose: false });
  };

  const handleCreateClinic = () => {
    setIsCreatingClinic({ open: true, canClose: true });
  };

  const handleCloseCreateClinic = () => {
    setIsCreatingClinic({ open: false, canClose: false });
  };

  const handleChangeCompany = async company => {
    setAppInitialized(false);
    setAppIsLoading(true);
    const response = await authAPI.changeClinic(company.id);
    if (response.isError) {
      console.error(response.message);
      setAppInitialized(false);
    } else {
      setUser(response.data);
      dispatch(setCurrentUser(response.data));
      setAppInitialized(true);
      setAppRefresh(true);
    }
    setAppIsLoading(false);
  };

  const fetchUser = async force => {
    if (!force && (!authManager.isLoggedIn() || user != null)) {
      return;
    }
    setAppIsLoading(true);
    const response = await authAPI.me();
    if (response.isError) {
      handleUserLogout();
      console.error(response.message);
    } else {
      const { data: user } = response;
      setUser(user);
      setIsCreatingClinic({
        open: user && user.clinicIds.length === 0,
        canClose: false,
      });
      dispatch(setCurrentUser(user));
      setAppInitialized(true);
    }
    setAppIsLoading(false);
  };

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
      <Modal
        centered
        className='loading-modal'
        show={appIsLoading}
        onHide={() => null}
      >
        <Modal.Body>
          <Spinner animation='border' />
          {textForKey('App initialization...')}
        </Modal.Body>
      </Modal>
      <MainMenu
        currentPath={currentPath}
        onCreateClinic={handleCreateClinic}
        onChangeCompany={handleChangeCompany}
      />
      <div className='data-container'>
        <PageHeader
          title={getPageTitle()}
          user={user}
          onLogout={handleStartLogout}
        />
        {appInitialized && (
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
