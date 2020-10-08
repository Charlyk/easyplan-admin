import React, { useEffect, useState } from 'react';

import './index.scss';
import 'react-phone-number-input/style.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'moment/locale/ro';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import moment from 'moment';
import { Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import ConfirmationModal from './components/ConfirmationModal';
import CreateClinicModal from './components/CreateClinicModal';
import DoctorsMain from './doctors/DoctorsMain';
import AcceptInvitation from './pages/General/AcceptInvitation';
import Login from './pages/Login';
import Main from './pages/Main';
import {
  setCreateClinic,
  setCurrentUser,
  triggerUserLogout,
} from './redux/actions/actions';
import {
  createClinicSelector,
  logoutSelector,
  newClinicIdSelector,
  updateCurrentUserSelector,
  userSelector,
} from './redux/selectors/rootSelector';
import authAPI from './utils/api/authAPI';
import { getAppLanguage, textForKey } from './utils/localization';
import authManager from './utils/settings/authManager';

function App() {
  moment.locale(getAppLanguage());
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);
  const newClinicId = useSelector(newClinicIdSelector);
  const updateCurrentUser = useSelector(updateCurrentUserSelector);
  const createClinic = useSelector(createClinicSelector);
  const logout = useSelector(logoutSelector);
  const [redirectUser, setRedirectUser] = useState(false);
  const selectedClinic = currentUser?.clinics?.find(
    item => item.id === currentUser?.selectedClinic,
  );
  const [isAppLoading, setAppIsLoading] = useState(false);

  useEffect(() => {
    if (selectedClinic != null) {
      const title = document.getElementById('site-title');
      if (title != null) {
        title.innerText = `EasyPlan - ${selectedClinic.clinicName}`;
      }
    }
  }, [selectedClinic]);

  useEffect(() => {
    if (currentUser == null) {
      fetchUser();
    } else if (currentUser.clinics.length === 0) {
      dispatch(setCreateClinic({ open: true, canClose: false }));
    }
  }, [currentUser, updateCurrentUser]);

  useEffect(() => {
    if (newClinicId != null) {
      changeCurrentClinic(newClinicId);
    }
  }, [newClinicId]);

  const redirectToHome = () => {
    setRedirectUser(true);
    setTimeout(() => setRedirectUser(false), 500);
  };

  const changeCurrentClinic = async clinicId => {
    setAppIsLoading(true);
    const response = await authAPI.changeClinic(clinicId);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(setCurrentUser(response.data));
      redirectToHome();
    }
    setAppIsLoading(false);
  };

  const fetchUser = async () => {
    if (!authManager.isLoggedIn()) {
      return;
    }
    setAppIsLoading(true);
    const response = await authAPI.me();
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data: user } = response;
      dispatch(setCurrentUser(user));
    }
    setAppIsLoading(false);
  };

  const handleCloseCreateClinic = () => {
    dispatch(setCreateClinic({ open: false, canClose: false }));
  };

  const handleClinicCreated = data => {
    handleCloseCreateClinic();
    dispatch(setCurrentUser(data));
  };

  const handleUserLogout = () => {
    authManager.logOut();
    dispatch(setCurrentUser(null));
    handleCancelLogout();
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogout(false));
  };

  return (
    <Router basename='/'>
      {redirectUser && <Redirect to='/' />}
      <React.Fragment>
        <ConfirmationModal
          title={textForKey('Logout')}
          message={textForKey('logout message')}
          onConfirm={handleUserLogout}
          onClose={handleCancelLogout}
          show={logout}
        />
        <CreateClinicModal
          onClose={createClinic.canClose ? handleCloseCreateClinic : null}
          open={createClinic.open}
          onCreate={handleClinicCreated}
        />
        <Modal
          centered
          className='loading-modal'
          show={isAppLoading}
          onHide={() => null}
        >
          <Modal.Body>
            <Spinner animation='border' />
            {textForKey('App initialization...')}
          </Modal.Body>
        </Modal>
        <Switch>
          <Route
            path='/clinic-invitation/:isNew?/:token'
            exact
            component={AcceptInvitation}
          />
          <Route path='/login' exact component={Login} />
          <Route
            path='/'
            component={
              selectedClinic?.roleInClinic === 'DOCTOR' ? DoctorsMain : Main
            }
          />
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
