import axios from "axios";
import cookie from 'cookie';
import updatedServerUrl from "../../../../app/utils/updateServerUrl";
import getSubdomain from "../../../../app/utils/getSubdomain";
import { HeaderKeys } from "../../../../app/utils/constants";
import { authorized } from "../../authorized";
import { handler } from "../../handler";


export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(updateDealState, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function updateDealState(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId } = req.query;
  return axios.put(`${updatedServerUrl(req)}/crm/deals/${dealId}/state`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    }
  });
}
