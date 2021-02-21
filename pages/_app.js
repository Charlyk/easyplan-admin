import { PubNubProvider } from "pubnub-react";
import CreateReactAppEntryPoint from "../src/App";
import { wrapper } from "../store";
import React from "react";
import Axios from "axios";
import moment from "moment-timezone";
import sessionManager from "../src/utils/settings/sessionManager";
import authManager from "../src/utils/settings/authManager";
import { setCreateClinic, toggleForceLogoutUser } from "../src/redux/actions/actions";
import PubNub from "pubnub";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/index.scss'

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
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <>
      <PubNubProvider client={pubnub}>
        {typeof window === 'undefined' ? null : <CreateReactAppEntryPoint/>}
      </PubNubProvider>
    </>
  );
}

export default wrapper.withRedux(NextApp)
