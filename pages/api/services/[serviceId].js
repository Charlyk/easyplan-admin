import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const response = await handler(restoreService, req, res);
      if (response == null) {
        return;
      }
      res.json(response);
      break;
    }
    case 'DELETE': {
      const response = await handler(deleteService, req, res);
      if (response == null) {
        return;
      }
      res.json(response);
      break;
    }
    case 'PUT': {
      const response = await handler(editService, req, res);
      if (response == null) {
        return;
      }
      res.json(response);
      break;
    }
    default:
      res.setHeader('Allow', ['PUT', 'DELETE', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function deleteService(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { serviceId } = req.query;
  return axios.delete(`${baseApiUrl}/services/v1/${serviceId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

function restoreService(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { serviceId } = req.query;
  return axios.get(`${baseApiUrl}/services/v1/${serviceId}/restore`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

function editService(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { serviceId } = req.query;
  const requestBody = req.body;
  return axios.put(`${baseApiUrl}/services/v1/${serviceId}`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
