import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const categories = await handler(fetchCategories, req, res);
      if (categories == null) {
        return;
      }
      const services = await handler(fetchServices, req, res);
      if (services == null) {
        return;
      }
      res.json({ categories, services });
      break;
    }
    case 'POST': {
      const response = await handler(createService, req, res);
      if (response == null) {
        return;
      }
      res.json(response);
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function fetchCategories(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${baseApiUrl}/categories`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

function fetchServices(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${baseApiUrl}/services`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

function createService(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.post(`${baseApiUrl}/services/v1/create`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
