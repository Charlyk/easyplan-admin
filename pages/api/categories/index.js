import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const response = await handler(createCategory, req, res);
      if (response == null) {
        return;
      }
      res.json(response);
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function createCategory(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.post(`${baseApiUrl}/categories/v1/create`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
