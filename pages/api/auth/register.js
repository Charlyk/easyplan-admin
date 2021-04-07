import axios from "axios";
import { handler } from "../handler";
import { updatedServerUrl } from "../../../utils/helperFuncs";

export default async function register(req, res) {
  const data = await handler(createNewAccount, req, res);
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
function createNewAccount(req) {
  return axios.post(
    `${updatedServerUrl(req)}/authentication/v1/register`,
    req.body,
    { headers: { 'X-EasyPlan-Clinic-Id': -1 } }
  );
}
