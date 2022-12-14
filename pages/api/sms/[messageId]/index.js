import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../../authorized';
import handler from '../../handler';

function deleteMessage(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { messageId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/sms/${messageId}`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

async function updateMessage(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { messageId } = req.query;
  return axios.put(`${updatedServerUrl(req)}/sms/${messageId}`, req.body, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}

async function setMessageDisabled(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { status, messageId } = req.query;
  const url = `${updatedServerUrl(req)}/sms/${messageId}/${status}`;
  return axios.put(
    url,
    {},
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
    case 'DELETE': {
      const data = await handler(deleteMessage, req, res);
      if (!data) {
        return;
      }
      res.json(data);
      break;
    }
    case 'PUT': {
      const data = await handler(setMessageDisabled, req, res);
      if (!data) {
        return;
      }
      res.json(data);
      break;
    }
    case 'POST': {
      const data = await handler(updateMessage, req, res);
      if (!data) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['DELETE', 'PUT', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});
