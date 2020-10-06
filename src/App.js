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

import DoctorsMain from './doctors/DoctorsMain';
import Login from './pages/Login';
import Main from './pages/Main';
import { setCurrentUser } from './redux/actions/actions';
import {
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
  const updateCurrentUser = useSelector(updateCurrentUserSelector);
  const selectedClinic = currentUser?.clinics?.find(
    item => item.id === currentUser?.selectedClinic,
  );
  const [isAppLoading, setAppIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser == null) {
      fetchUser();
    }
  }, [currentUser, updateCurrentUser]);

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

  return (
    <Router basename='/'>
      {selectedClinic?.roleInClinic === 'DOCTOR' && <Redirect to='/' />}
      <React.Fragment>
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
