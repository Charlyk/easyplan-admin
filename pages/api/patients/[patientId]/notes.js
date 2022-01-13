import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../../authorized';
import handler from '../../handler';

function fetchPatientNotes(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { patientId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/patients/${patientId}/notes`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

function createPatientNote(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { patientId } = req.query;
  return axios.post(
    `${updatedServerUrl(req)}/patients/${patientId}/notes`,
    req.body,
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
    case 'GET': {
      const data = await handler(fetchPatientNotes, req, res);
      if (data) {
        res.json(data);
      }
      break;
    }
    case 'POST': {
      const data = await handler(createPatientNote, req, res);
      if (data) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});
