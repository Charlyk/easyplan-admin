import axios from 'axios';
import { handler } from "../handler";
import getSubdomain from "../../../utils/getSubdomain";
import { baseApiUrl } from "../../../eas.config";

export default async function login(req, res) {
  const data = await handler(authenticateWithBackend, req, res);
  if (data != null) {
    res.status(200).json(data);
  }
}

/**
 * Authenticate an user with EasyPlan backend
 * @param req
 * @return {Promise<AxiosResponse<any>>}
 */
function authenticateWithBackend(req) {
  return axios.post(
    `${baseApiUrl}/authentication/v1/login`,
    req.body,
    {
      headers: {
        'X-EasyPlan-Subdomain': getSubdomain(req),
      }
    }
  );
}
