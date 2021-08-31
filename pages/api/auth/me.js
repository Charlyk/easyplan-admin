import axios from "axios";
import { authorized } from "../authorized";
import { handler } from "../handler";
import { getSubdomain, updatedServerUrl } from "../../../utils/helperFuncs";
import { parseCookies } from "../../../utils";
import { HeaderKeys } from "../../../app/utils/constants";

export default authorized(async (req, res) => {
  const data = await handler(getCurrentUser, req, res);
  if (data != null) {
    res.json(data);
  }
});

function getCurrentUser(req) {
  const { auth_token } = parseCookies(req);
  return axios.get(`${updatedServerUrl(req)}/authentication/v1/me`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
