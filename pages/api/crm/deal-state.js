import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../app/utils/getSubdomain";
import { HeaderKeys } from "../../../app/utils/constants";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { handler } from "../handler";
import { authorized } from "../authorized";


export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchDealStates, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'POST': {
      const data = await handler(createNewDealState, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(updateDealState, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'DELETE': {
      const data = await handler(deleteDealState, req, res);
      if (data != null) {
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

async function fetchDealStates(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/crm/deal-state`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

async function createNewDealState(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.post(`${updatedServerUrl(req)}/crm/deal-state`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    }
  });
}

async function updateDealState(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId } = req.query;
  return axios.put(`${updatedServerUrl(req)}/crm/deal-state/${dealId}`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    }
  });
}



async function deleteDealState(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/crm/deal-state/${dealId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
