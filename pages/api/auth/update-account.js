import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { handler } from "../handler";
import cookie from "cookie";

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

function updateUserAccount(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.put(`${baseApiUrl}/authentication/v1/update-account`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
