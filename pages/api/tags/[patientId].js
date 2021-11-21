import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { authorized } from '../authorized';
import { handler } from '../handler';

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(assignTag, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'DELETE': {
      const data = await handler(removeTag, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function assignTag(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { tagId, patientId } = req.query;
  return axios.put(
    `${updatedServerUrl(req)}/tags/${tagId}/${patientId}`,
    req.body,
    {
      headers: {
        [HeaderKeys.authorization]: auth_token,
        [HeaderKeys.clinicId]: clinic_id,
        [HeaderKeys.subdomain]: getSubdomain(req),
      },
    },
  );
}

async function removeTag(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { tagId, patientId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/tags/${tagId}/${patientId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}
