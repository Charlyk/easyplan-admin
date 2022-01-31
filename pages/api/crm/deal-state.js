import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

async function fetchDealStates(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const queryString = new URLSearchParams(req.query).toString();
  return axios.get(`${updatedServerUrl()}/crm/deal-state?${queryString}`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

async function createNewDealState(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  return axios.post(`${updatedServerUrl(req)}/crm/deal-state`, req.body, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}

async function updateDealState(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { dealId } = req.query;
  return axios.put(
    `${updatedServerUrl(req)}/crm/deal-state/${dealId}`,
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

async function deleteDealState(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { dealId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/crm/deal-state/${dealId}`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchDealStates, req, res);
      if (data) {
        res.json(data);
      }
      break;
    }
    case 'POST': {
      const data = await handler(createNewDealState, req, res);
      if (data) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(updateDealState, req, res);
      if (data) {
        res.json(data);
      }
      break;
    }
    case 'DELETE': {
      const data = await handler(deleteDealState, req, res);
      if (data) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});
