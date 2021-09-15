import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import getSubdomain from "../../../utils/getSubdomain";
import updatedServerUrl from "../../../utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchPhoneRecords, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
});

async function fetchPhoneRecords(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query).toString();
  return axios.get(`${updatedServerUrl(req)}/patients/phone-records?${queryString}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
