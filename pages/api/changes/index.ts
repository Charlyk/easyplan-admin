import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

async function getAllRecentChanges(req, _) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  return axios.get(`${updatedServerUrl()}/change-logs`, { headers });
}

async function markChangesAsRead(req, _) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  return axios.put(`${updatedServerUrl()}/change-logs`, req.body, { headers });
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET':
      {
        const data = await handler(getAllRecentChanges, req, res);
        if (data) {
          res.json(data);
        }
      }
      break;
    case 'PUT':
      {
        const data = await handler(markChangesAsRead, req, res);
        if (data) {
          res.json(data);
        }
      }
      break;
    default:
      res.setHeaders('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
