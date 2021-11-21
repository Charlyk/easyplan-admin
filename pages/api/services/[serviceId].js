import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

function deleteService(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { serviceId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/services/v1/${serviceId}`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

function restoreService(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { serviceId } = req.query;
  return axios.get(
    `${updatedServerUrl(req)}/services/v1/${serviceId}/restore`,
    {
      headers: {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinicId,
        [HeaderKeys.subdomain]: getSubdomain(req),
      },
    },
  );
}

function editService(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { serviceId } = req.query;
  return axios.put(
    `${updatedServerUrl(req)}/services/v1/${serviceId}`,
    req.body,
    {
      headers: {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinicId,
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}

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
