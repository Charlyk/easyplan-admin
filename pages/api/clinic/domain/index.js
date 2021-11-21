import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import handler from '../../handler';

function checkDomainExists(req) {
  const query = new URLSearchParams(req.query).toString();
  return axios.get(`${updatedServerUrl(req)}/clinics/domain-check?${query}`, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(checkDomainExists, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};
