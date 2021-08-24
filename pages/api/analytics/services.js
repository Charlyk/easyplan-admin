import { authorized } from "../authorized";
import cookie from "cookie";
import axios from "axios";
import { handler } from "../handler";
import { getSubdomain, updatedServerUrl } from "../../../utils/helperFuncs";
import { HeaderKeys } from "../../../app/utils/constants";

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
  const url = `${updatedServerUrl(req)}/analytics/services?${queryString}`;
  return axios.get(url, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
