import moment from "moment-timezone";
import Axios from "axios";
import cookie from 'cookie';

Axios.interceptors.request.use(function (config) {
  config.headers['x-EasyPlan-TimeZone'] = moment.tz.guess(true);
  config.headers['Accept-Language'] = 'ro';
  config.headers['X-EasyPlan-Platform'] = 'web';
  return config;
});

export function parseCookies(req) {
  return cookie.parse(req?.headers?.cookie || '');
}
