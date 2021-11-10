import { authorized } from "../authorized";
import cookie from "cookie";
import axios from "axios";
import { handler } from "../handler";
import getSubdomain from "../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";

export const config = { api: { bodyParser: false } };

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
  const url = `${updatedServerUrl(req)}/analytics/general?${queryString}`;
  return axios.get(url, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

const fetchIncomeStats = (req) => {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query);
  const url = `${updatedServerUrl(req)}/analytics/finance?${queryString}`;
  return axios.get(url, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
