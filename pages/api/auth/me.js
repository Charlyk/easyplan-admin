import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

function getCurrentUser(req) {
  const { auth_token: authToken } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/authentication/v1/me`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

export default authorized(async (req, res) => {
  const data = await handler(getCurrentUser, req, res);
  if (data) {
    res.json(data);
  }
});
