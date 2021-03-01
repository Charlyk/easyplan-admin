import moment from "moment-timezone";
import Axios from "axios";
import cookie from 'cookie';

Axios.interceptors.request.use(function (config) {
  config.headers['x-EasyPlan-TimeZone'] = moment.tz.guess(true);
  return config;
});

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}
