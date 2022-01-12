import axios from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

function fetchUnreadNotification(req: NextApiRequest) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  return axios.get(`${updatedServerUrl()}/app-notifications`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.clinicId]: clinicId,
    },
  });
}

export default authorized(async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchUnreadNotification, req, res);
      if (data !== false) {
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
