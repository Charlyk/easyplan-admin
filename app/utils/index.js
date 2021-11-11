import moment from "moment-timezone";
import Axios from "axios";
import { environment } from "../../eas.config";

Axios.interceptors.request.use(function (config) {
  config.headers['X-EasyPlan-TimeZone'] = moment.tz.guess(true);
  config.headers['Accept-Language'] = 'ro';
  config.headers['X-EasyPlan-Platform'] = 'web';
  if (environment === 'testing') {
    config.headers['Origin'] = '*';
  }
  return config;
});
