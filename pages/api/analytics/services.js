import { authorized } from "../authorized";
import cookie from "cookie";
import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { handler } from "../handler";

export default authorized(async (req, res) => {
  const data = await handler(fetchServicesStatistics, req, res);
  if (data == null) {
    return;
  }

  res.json(data);
});

const fetchServicesStatistics = async (req) => {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query);
  const url = `${baseApiUrl}/analytics/services?${queryString}`;
  return axios.get(url, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
