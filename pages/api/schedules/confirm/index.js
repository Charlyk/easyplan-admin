import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import handler from '../../handler';

async function confirmSchedule(req) {
  return axios.post(
    `${updatedServerUrl(req)}/confirmation/schedule`,
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
    case 'POST': {
      const data = await handler(confirmSchedule, req, res);
      if (data !== false) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};
