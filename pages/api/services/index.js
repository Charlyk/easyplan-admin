import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { authorized } from '../authorized';
import { handler } from '../handler';

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
  return axios.get(`${updatedServerUrl(req)}/categories`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

function fetchServices(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/services`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

function createService(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.post(`${updatedServerUrl(req)}/services/v1/create`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}
