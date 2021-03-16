import { authorized } from "../authorized";
import cookie from "cookie";
import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { handler } from "../handler";

const emptyResponse = {
  scheduleStats: {
    total: 0,
    items: [],
  },
  financeStats: {
    expectations: { persons: 0, amount: 0 },
    confirmed: { persons: 0, amount: 0 },
    canceled: { persons: 0, amount: 0 },
    finished: { persons: 0, amount: 0 },
    debts: { persons: 0, amount: 0 },
    paid: { persons: 0, amount: 0 },
  }
}

export default authorized(async (req, res) => {
  const scheduleStats = await handler(fetchScheduleStats, req, res);
  if (scheduleStats == null) {
    res.json(emptyResponse);
    return;
  }
  const financeStats = await handler(fetchIncomeStats, req, res);
  if (financeStats == null) {
    res.json(emptyResponse);
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
