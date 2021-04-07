import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import { updatedServerUrl } from "../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(createClinic, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(updateClinicInfo, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'DELETE': {
      const data = await handler(deleteClinic, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
});

async function createClinic(req) {
  const { auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.post(`${updatedServerUrl(req)}/clinics`, requestBody, {
    headers: { Authorization: auth_token }
  });
}

async function updateClinicInfo(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.put(`${updatedServerUrl(req)}/clinics`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

async function deleteClinic(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.delete(`${updatedServerUrl(req)}/clinics`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
