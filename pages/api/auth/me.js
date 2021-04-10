import axios from "axios";
import { authorized } from "../authorized";
import { handler } from "../handler";
import { updatedServerUrl } from "../../../utils/helperFuncs";
import { parseCookies } from "../../../utils";

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
      Authorization: auth_token,
    }
  });
}
