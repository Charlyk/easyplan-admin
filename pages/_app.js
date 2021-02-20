import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/index.scss';
import React, { useEffect, useState } from "react";
import CreateReactAppEntryPoint from "../src/App";
import PubNub from "pubnub";
import authManager from "../src/utils/settings/authManager";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import timerMiddleware from "redux-timer-middleware";
import rootReducer from "../src/redux/reducers/rootReducer";
import { Provider } from "react-redux";
import { PubNubProvider } from "pubnub-react";
import Axios from "axios";
import moment from "moment-timezone";
import sessionManager from "../src/utils/settings/sessionManager";
import { setCreateClinic, toggleForceLogoutUser } from "../src/redux/actions/actions";

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
    const url = error?.response?.config?.url || '';
    const status = error?.response?.status;
    const method = error?.response?.config?.method;
    const unauthorizedRequest =
      status === 401 &&
      !url.includes('/confirmation') &&
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

function NextApp() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || typeof window === 'undefined') {
    return null
  }

  return (
    <Provider store={ReduxStore}>
      <PubNubProvider client={pubnub}>
        <CreateReactAppEntryPoint />
      </PubNubProvider>
    </Provider>
  );
}

export default NextApp
