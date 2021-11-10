import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../app/utils/getSubdomain";
import { HeaderKeys } from "../../../app/utils/constants";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { handler } from "../handler";
import { authorized } from "../authorized";

export const config = { api: { bodyParser: false } };

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchAllDealState, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(updateDealStateVisibility, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function fetchAllDealState(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/clinics/crm-columns`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

async function updateDealStateVisibility(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.put(`${updatedServerUrl(req)}/clinics/crm-columns`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
