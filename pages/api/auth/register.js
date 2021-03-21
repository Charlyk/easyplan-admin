import { baseApiUrl, isDev } from "../../../eas.config";
import cookie from "cookie";
import axios from "axios";
import { setCookies } from "../../../utils/helperFuncs";

export default async function register(req, res) {
  const response = await createNewAccount(req.body);
  if (response.status !== 200) {
    res.json({ error: true, message: response.statusText });
  } else {
    const { isError, message, data } = response.data;
    if (isError) {
      res.json({ message, error: true });
    } else {
      const { user, token } = data;
      setCookies(res, token);
      res.status(200).json(user);
    }
  }
}

/**
 * Authenticate an user with EasyPlan backend
 * @param {{firstName: string, lastName: string, avatar: string, username: string, password: string, phoneNumber: string}} requestBody
 * @return {Promise<AxiosResponse<any>>}
 */
function createNewAccount(requestBody) {
  return axios.post(
    `${baseApiUrl}/authentication/v1/register`,
    requestBody,
    { headers: { 'X-EasyPlan-Clinic-Id': -1 } }
  );
}
