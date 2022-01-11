import axios, { AxiosResponse } from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { PatientVisit, ServerResponse } from 'types';
import authorized from '../authorized';
import handler from '../handler';

async function updateVisit(
  req,
): Promise<AxiosResponse<ServerResponse<PatientVisit>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { visitId } = req.query;
  return axios.put(`${updatedServerUrl()}/visits/${visitId}`, req.body, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(updateVisit, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});
