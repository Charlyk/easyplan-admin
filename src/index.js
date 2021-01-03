import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import timerMiddleware from 'redux-timer-middleware';

import App from './App';
import { toggleForceLogoutUser } from './redux/actions/actions';
import rootReducer from './redux/reducers/rootReducer';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import authManager from './utils/settings/authManager';

import Axios from 'axios';
import { PubNubProvider } from 'pubnub-react';
import PubNub from 'pubnub';

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

Axios.interceptors.request.use(function(config) {
  if (authManager.isLoggedIn()) {
    config.headers.Authorization = authManager.getUserToken();
  }
  return config;
});

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: authManager.getUserId() || PubNub.generateUUID(),
});

ReactDOM.render(
  <Provider store={ReduxStore}>
    <React.StrictMode>
      <PubNubProvider client={pubnub}>
        <App />
      </PubNubProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
