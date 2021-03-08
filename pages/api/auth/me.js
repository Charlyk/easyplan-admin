import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";

export default authorized(async (req, res) => {
  const data = await handler(getCurrentUser, req, res);
  if (data != null) {
    res.json(data);
  }
});

function getCurrentUser(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${baseApiUrl}/authentication/v1/me`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
