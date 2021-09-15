import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import getSubdomain from "../../../../utils/getSubdomain";
import updatedServerUrl from "../../../../utils/updateServerUrl";
import { HeaderKeys } from "../../../../app/utils/constants";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'DELETE': {
      const data = await handler(deleteMessage, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'PUT': {
      const data = await handler(setMessageDisabled, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'POST': {
      const data = await handler(updateMessage, req, res);
      if (data == null) {
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

function deleteMessage(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { messageId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/sms/${messageId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

async function updateMessage(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { messageId } = req.query;
  const requestBody = req.body;
  return axios.put(`${updatedServerUrl(req)}/sms/${messageId}`, requestBody, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

async function setMessageDisabled(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { status, messageId } = req.query;
  const url = `${updatedServerUrl(req)}/sms/${messageId}/${status}`
  return axios.put(url, {}, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
