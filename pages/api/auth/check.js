import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

function checkIsAuthenticated(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  return axios.get(`${updatedServerUrl(req)}/authentication/v1/check`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.clinicId]: clinicId,
    },
  });
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(checkIsAuthenticated, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default: {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});
