import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { handler } from '../../handler';

export default async function clinicDetails(req, res) {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchAvailableCurrencies, req, res);
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
}

async function fetchAvailableCurrencies(req) {
  return axios.get(`${updatedServerUrl(req)}/clinics/available-currencies`, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}
