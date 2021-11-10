import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";
import { authorized } from "../authorized";
import { handler } from "../handler";

export const config = { api: { bodyParser: false } };

export default authorized(async function clinicDetails(req, res) {
  switch (req.method) {
    case 'GET': {
      const data = await handler(getClinicAllClinicForOwner, req, res);
      if (data != null) {
        res.json(data);
      }
      break
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
});

function getClinicAllClinicForOwner(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/clinics/owner`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
