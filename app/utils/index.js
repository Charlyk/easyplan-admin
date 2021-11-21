import Axios from 'axios';
import moment from 'moment-timezone';

Axios.interceptors.request.use(function (config) {
  config.headers['X-EasyPlan-TimeZone'] =
    moment.tz.guess(true) ??
    Intl.DateTimeFormat().resolvedOptions().timeZone ??
    'Europe/Chisinau';
  config.headers['Accept-Language'] = 'ro';
  config.headers['X-EasyPlan-Platform'] = 'web';
  return config;
});
