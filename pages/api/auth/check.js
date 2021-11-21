import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import parseCookies from 'app/utils/parseCookies';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { authorized } from '../authorized';
import { handler } from '../handler';

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

function checkIsAuthenticated(req) {
  const { auth_token, clinic_id } = parseCookies(req);
  return axios.get(`${updatedServerUrl(req)}/authentication/v1/check`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.clinicId]: clinic_id,
    },
  });
}
