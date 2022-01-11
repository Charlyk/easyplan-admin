import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../../authorized';
import handler from '../../handler';

async function updateCabinet(req, _) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const { cabinetId } = req.query;

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  return axios.put(`${updatedServerUrl()}/cabinets/${cabinetId}`, req.body, {
    headers,
  });
}

async function deleteCabinet(req, _) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const { cabinetId } = req.query;

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  return axios.delete(`${updatedServerUrl()}/cabinets/${cabinetId}`, {
    headers,
  });
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT':
      {
        const data = await handler(updateCabinet, req, res);
        if (data !== false) {
          res.json(data);
        }
      }
      break;
    case 'DELETE':
      {
        const data = await handler(deleteCabinet, req, res);
        if (data !== false) {
          res.json(data);
        }
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
