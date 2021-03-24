import axios from "axios";
import { baseApiUrl } from "../../../../eas.config";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT':
      const data = await handler(restoreUser, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    default: {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});

function restoreUser(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { userId } = req.query;
  return axios.put(`${baseApiUrl}/users/${userId}/restore`, {}, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
