import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../../authorized';
import handler from '../../handler';

function restoreUser(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { userId } = req.query;
  return axios.put(
    `${updatedServerUrl(req)}/users/${userId}/restore`,
    {},
    {
      headers: {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinicId,
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(restoreUser, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default: {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});
