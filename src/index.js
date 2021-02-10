import React from 'react';

import Axios from 'axios';
import moment from 'moment';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import timerMiddleware from 'redux-timer-middleware';

import App from './App';
import {
  setCreateClinic,
  toggleForceLogoutUser,
} from './redux/actions/actions';
import rootReducer from './redux/reducers/rootReducer';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import authManager from './utils/settings/authManager';
import sessionManager from './utils/settings/sessionManager';

// enable redux devtool
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;
const middlewares = [thunk, timerMiddleware];
const enhancer = composeEnhancers(applyMiddleware(...middlewares));
const ReduxStore = createStore(rootReducer, enhancer);

Axios.interceptors.request.use(function (config) {
  const timezone = moment.tz.guess(true);
  config.headers['X-EasyPlan-Clinic-Id'] = sessionManager.getSelectedClinicId();
  config.headers['x-EasyPlan-TimeZone'] = timezone;
  if (authManager.isLoggedIn()) {
    config.headers.Authorization = authManager.getUserToken();
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const method = error?.response?.config?.method;
    console.log(error.response);
    const unauthorizedRequest =
      status === 401 &&
      (method === 'get' ||
        method === 'post' ||
        method === 'put' ||
        method === 'delete');

    if (unauthorizedRequest) {
      ReduxStore.dispatch(toggleForceLogoutUser(true));
      ReduxStore.dispatch(setCreateClinic({ open: false, canClose: true }));
    }
    return error;
  },
);

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: authManager.getUserId() || PubNub.generateUUID(),
});

ReactDOM.render(
  <Provider store={ReduxStore}>
    <PubNubProvider client={pubnub}>
      <App />
    </PubNubProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
