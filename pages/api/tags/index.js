import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { authorized } from '../authorized';
import { handler } from '../handler';

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchAllTags, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'POST': {
      const data = await handler(createNewTag, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'DELETE': {
      const data = await handler(deleteTag, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function createNewTag(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.post(`${updatedServerUrl(req)}/tags`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

async function deleteTag(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { tagId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/tags/${tagId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

async function fetchAllTags(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/tags`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}
