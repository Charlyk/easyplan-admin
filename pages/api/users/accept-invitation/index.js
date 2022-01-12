import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import handler from '../../handler';

function fetchUsers(req) {
  return axios.put(
    `${updatedServerUrl(req)}/users/accept-invitation`,
    req.body,
    {
      headers: {
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}

export default async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(fetchUsers, req, res);
      if (data) {
        res.status(200).json(data);
      }
      break;
    }
    default: {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
};
