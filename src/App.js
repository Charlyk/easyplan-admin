import React from 'react';

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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';
import { getAppLanguage } from './utils/localization';

function App() {
  moment.locale(getAppLanguage());
  return (
    <Router basename='/'>
      <React.Fragment>
        <Switch>
          <Route path='/login' exact component={Login} />
          <Route path='/' component={Main} />
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
