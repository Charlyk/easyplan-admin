import axios from "axios";
import { handler } from "../handler";
import getSubdomain from "../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";

export const config = { api: { bodyParser: false } };

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
    {
      headers: {
        [HeaderKeys.clinicId]: -1,
        [HeaderKeys.subdomain]: getSubdomain(req),
      }
    }
  );
}
