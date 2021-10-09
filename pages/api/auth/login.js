import axios from 'axios';
import getSubdomain from "../../../app/utils/getSubdomain";
import { HeaderKeys } from "../../../app/utils/constants";
import { baseApiUrl } from "../../../eas.config";
import { handler } from "../handler";

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
        [HeaderKeys.subdomain]: getSubdomain(req),
      }
    }
  );
}
