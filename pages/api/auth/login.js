import axios from 'axios';
import { handler } from "../handler";
import { updatedServerUrl } from "../../../utils/helperFuncs";

export default async function login(req, res) {
  const data = await handler(authenticateWithBackend, req, res);
  if (data != null) {
    const { user } = data;
    res.status(200).json(user);
  }
}

/**
 * Authenticate an user with EasyPlan backend
 * @param req
 * @return {Promise<AxiosResponse<any>>}
 */
function authenticateWithBackend(req) {
  return axios.post(
    `${updatedServerUrl(req)}/authentication/v1/login`,
    req.body,
    { headers: { 'X-EasyPlan-Clinic-Id': -1 } }
  );
}
