import axios from "axios";
import cookie from "cookie";
import getSubdomain from "../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";
import { handler } from "../handler";

export default async function resetPassword(req, res) {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(updateUserAccount, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default: {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
}

export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

function updateUserAccount(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.put(`${updatedServerUrl(req)}/authentication/v1/update-account`, requestBody, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    }
  });
}
