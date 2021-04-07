import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import { updatedServerUrl } from "../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchSchedules, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'POST': {
      const data = await handler(createNewSchedule, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function createNewSchedule(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.post(`${updatedServerUrl(req)}/schedules`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

async function fetchSchedules(req) {
  const { period } = req.query;
  switch (period) {
    case 'day':
      return fetchDaySchedules(req);
    case 'month':
      return fetchMonthSchedules(req);
    default:
      return fetchDoctorSchedules(req);
  }
}

async function fetchDoctorSchedules(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query).toString()
  return axios.get(`${updatedServerUrl(req)}/schedules?${queryString}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

async function fetchDaySchedules(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query).toString()
  return axios.get(`${updatedServerUrl(req)}/schedules/v2/day?${queryString}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

async function fetchMonthSchedules(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query).toString();
  return axios.get(`${updatedServerUrl(req)}/schedules/month-schedules?${queryString}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
