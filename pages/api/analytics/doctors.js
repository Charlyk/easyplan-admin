import { authorized } from "../authorized";
import cookie from "cookie";
import axios from "axios";
import { handler } from "../handler";
import { getSubdomain, updatedServerUrl } from "../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  const data = await handler(fetchDoctorsStatistics, req, res);
  if (data == null) {
    return;
  }

  res.json(data);
});

const fetchDoctorsStatistics = async (req) => {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query);
  const url = `${updatedServerUrl(req)}/analytics/doctors?${queryString}`;
  return axios.get(url, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
      'X-EasyPlan-Subdomain': getSubdomain(req),
    }
  });
}
