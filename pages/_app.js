import React, { useEffect } from "react";
import { PubNubProvider } from "pubnub-react";
import { wrapper } from "../store";
import authManager from "../src/utils/settings/authManager";
import AppComponent from '../src/App';
import PubNub from "pubnub";
import { login, me } from "../api/user";
import { CookiesProvider, useCookies } from "react-cookie";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/index.scss'
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../src/redux/actions/actions";
import moment from "moment-timezone";
import { setClinic } from "../src/redux/actions/clinicActions";
import { fetchClinicDetails } from "../api/clinic";

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: authManager.getUserId() || PubNub.generateUUID(),
});

function NextApp({ Component, pageProps }) {
  const [cookie, setCookie] = useCookies(['auth_token', 'clinic_id']);
  const dispatch = useDispatch();

  useEffect(() => {
    saveAuthData();
  }, []);

  const saveAuthData = async () => {
    const response = await login('eduard.albu@gmail.com', 'CDTjm055!');
    if (response.isError) {
      console.error(response);
      return;
    }

    const { token, user } = response.data;
    const selectedClinic = user.clinics.find(item => item.isSelected) || user.clinics[0];
    const headers = {
      Authorization: token,
      'X-EasyPlan-Clinic-Id': selectedClinic.clinicId,
    }
    const clinicResponse = await fetchClinicDetails(headers)
    if (!clinicResponse.isError) {
      const clinicData = clinicResponse.data;
      moment.tz.setDefault(clinicData.timeZone);
      dispatch(setClinic(clinicData));
    }
    setCookie('auth_token', token);
    setCookie('clinic_id', selectedClinic.clinicId);
    dispatch(setCurrentUser(user));
  }

  return (
    <PubNubProvider client={pubnub}>
      <CookiesProvider>
        <AppComponent>
          <Component {...pageProps} />
        </AppComponent>
      </CookiesProvider>
    </PubNubProvider>
  );
}

export default wrapper.withRedux(NextApp)
