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
      const data = await handler(fetchDealDetails, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function fetchDealDetails(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/crm/deals/details/${dealId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
