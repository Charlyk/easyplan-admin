import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT':
      const data = await handler(setUserIsCashier, req, res);
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

function setUserIsCashier(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { userId } = req.query;
  return axios.put(`${updatedServerUrl(req)}/users/${userId}/cashier`, req.body, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
