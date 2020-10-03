import React, { useEffect, useState } from 'react';

import './styles.scss';

import { useLocation, useHistory, Switch, Route } from 'react-router-dom';

import MainMenu from '../../components/MainMenu';
import PageHeader from '../../components/PageHeader';
import paths from '../../utils/paths';
import authManager from '../../utils/settings/authManager';
import Calendar from '../Calendar';
import Categories from '../Categories';
import Patients from '../Patients';
import Users from '../Users';

const Main = props => {
  const location = useLocation();
  const history = useHistory();
  const [currentPath, setCurrentPath] = useState(location.pathname);

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
    authManager.logOut();
    history.push('/login');
  };

  return (
    <div className='main-page' id='main-page'>
      <MainMenu currentPath={currentPath} />
      <div className='data-container'>
        <PageHeader title={getPageTitle()} onLogout={handleUserLogout} />
        <div className='data'>
          <Switch>
            <Route path='/categories' component={Categories} />
            <Route path='/users' component={Users} />
            <Route path='/calendar' component={Calendar} />
            <Route path='/patients' component={Patients} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Main;
