import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../utils/getSubdomain";
import { HeaderKeys } from "../../../app/utils/constants";
import updatedServerUrl from "../../../utils/updateServerUrl";
import { handler } from "../handler";
import { authorized } from "../authorized";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(linkPatient, req, res);
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

async function linkPatient(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId } = req.query;
  return axios.put(`${updatedServerUrl(req)}/crm/deals/link-patient/${dealId}`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
