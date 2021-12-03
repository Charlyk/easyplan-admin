import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

async function createClinic(req) {
  const { auth_token: authToken } = cookie.parse(req.headers.cookie);
  return axios.post(`${updatedServerUrl(req)}/clinics`, req.body, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}

async function updateClinicInfo(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const requestBody = req.body;
  return axios.put(`${updatedServerUrl(req)}/clinics`, requestBody, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}

async function deleteClinic(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  return axios.delete(`${updatedServerUrl(req)}/clinics`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

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
      break;
  }
});
