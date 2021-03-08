import moment from "moment-timezone";
import Axios from "axios";
import cookie from 'cookie';

Axios.interceptors.request.use(function (config) {
  config.headers['x-EasyPlan-TimeZone'] = moment.tz.guess(true);
  return config;
});

export function getHeaders(req) {
  const { auth_token, clinic_id } = parseCookies(req);
  return {
    'Authorization': auth_token,
    'X-EasyPlan-Clinic-Id': clinic_id
  }
}

export function parseCookies(req) {
  return cookie.parse(req?.headers?.cookie || '');
}
