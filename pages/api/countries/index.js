import axios from "axios";
import cookie from 'cookie';
import { handler } from "../handler";
import getSubdomain from "../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";


export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

export default async function countries(req, res) {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchCountries, req, res);
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
};

async function fetchCountries(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  let headers = {
    [HeaderKeys.subdomain]: getSubdomain(req),
  };
  if (clinic_id) headers[HeaderKeys.clinicId] = clinic_id;
  if (auth_token) headers[HeaderKeys.authorization] = auth_token;
  return axios.get(`${updatedServerUrl(req)}/countries`, { headers });
}
