import moment from "moment-timezone";
import Axios from "axios";
import { Agent } from "https";
import { environment } from "../../eas.config";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = environment === 'production' ? '1' : '0';

Axios.interceptors.request.use(function (config) {
  config.headers['X-EasyPlan-TimeZone'] = moment.tz.guess(true);
  config.headers['Accept-Language'] = 'ro';
  config.headers['X-EasyPlan-Platform'] = 'web';
  config.httpsAgent = new Agent({
    rejectUnauthorized: environment === 'production',
  });
  return config;
});
