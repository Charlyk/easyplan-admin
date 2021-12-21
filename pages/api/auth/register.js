import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import handler from '../handler';

export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

function createNewAccount(req) {
  return axios.post(
    `${updatedServerUrl(req)}/authentication/v1/register`,
    req.body,
    {
      headers: {
        [HeaderKeys.clinicId]: -1,
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}

export default async function register(req, res) {
  switch (req.method) {
    case 'POST': {
      const data = await handler(createNewAccount, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default: {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
}
