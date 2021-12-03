import Axios from 'axios';
import moment from 'moment-timezone';

Axios.interceptors.request.use(function (config) {
  if (config?.headers == null) {
    return config;
  }
  const timeZone =
    moment.tz.guess(true) ??
    Intl.DateTimeFormat().resolvedOptions().timeZone ??
    'Europe/Chisinau';

  if (timeZone) {
    config.headers['X-EasyPlan-TimeZone'] = timeZone;
  }
  config.headers['Accept-Language'] = 'ro';
  config.headers['X-EasyPlan-Platform'] = 'web';
  return config;
});
