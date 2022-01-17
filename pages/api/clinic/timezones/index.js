import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import handler from '../../handler';

function fetchAvailableTimeZones(req) {
  return axios.get(`${updatedServerUrl(req)}/clinics/available-timezones`, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchAvailableTimeZones, req, res);
      if (data) {
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
