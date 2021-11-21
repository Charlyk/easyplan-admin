import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { handler } from '../handler';

export default async function register(req, res) {
  const data = await handler(createNewAccount, req, res);
  if (data != null) {
    const { user } = data;
    res.status(200).json(user);
  }
}

export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

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
        ...req.headers,
        [HeaderKeys.clinicId]: -1,
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}
