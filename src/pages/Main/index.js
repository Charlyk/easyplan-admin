import React, { useEffect, useState } from 'react';

import './styles.scss';

import { Modal, Spinner } from 'react-bootstrap';
import { useLocation, useHistory, Switch, Route } from 'react-router-dom';

import CreateClinicModal from '../../components/CreateClinicModal';
import MainMenu from '../../components/MainMenu';
import PageHeader from '../../components/PageHeader';
import authAPI from '../../utils/api/authAPI';
import { textForKey } from '../../utils/localization';
import paths from '../../utils/paths';
import authManager from '../../utils/settings/authManager';
import Calendar from '../Calendar';
import Categories from '../Categories';
import Patients from '../Patients';
import Users from '../Users';

const Main = props => {
  const location = useLocation();
  const history = useHistory();
  const [appIsLoading, setAppIsLoading] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [props]);

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

  const handleUserLogout = () => {
    setUser(null);
    setAppInitialized(false);
    authManager.logOut();
    history.push('/login');
  };

  const handleClinicCreated = () => {
    fetchUser(true);
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
      setUser(response.data);
      setAppInitialized(true);
    }
    setAppIsLoading(false);
  };

  return (
    <div className='main-page' id='main-page'>
      <CreateClinicModal
        open={user && user.clinicIds.length === 0}
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
      <MainMenu currentPath={currentPath} />
      <div className='data-container'>
        <PageHeader
          title={getPageTitle()}
          user={user}
          onLogout={handleUserLogout}
        />
        {appInitialized && (
          <div className='data'>
            <Switch>
              <Route path='/categories' component={Categories} />
              <Route path='/users' component={Users} />
              <Route path='/calendar' component={Calendar} />
              <Route path='/patients' component={Patients} />
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
