import { authorized } from "../authorized";
import cookie from "cookie";
import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { handler } from "../handler";

export default authorized(async (req, res) => {
  const scheduleStats = await handler(fetchScheduleStats, req, res);
  if (scheduleStats == null) {
    return;
  }
  const financeStats = await handler(fetchIncomeStats, req, res);
  if (financeStats == null) {
    return;
  }

  res.json({
    scheduleStats,
    financeStats
  });
});

const fetchScheduleStats = async (req) => {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query);
  const url = `${baseApiUrl}/analytics/general?${queryString}`;
  return axios.get(url, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

const fetchIncomeStats = (req) => {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query);
  const url = `${baseApiUrl}/analytics/finance?${queryString}`;
  return axios.get(url, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
