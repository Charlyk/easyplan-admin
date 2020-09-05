import React from 'react';

import './index.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';

function App() {
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
