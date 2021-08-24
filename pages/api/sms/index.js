import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import { getSubdomain, updatedServerUrl } from "../../../utils/helperFuncs";
import { HeaderKeys } from "../../../app/utils/constants";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchMessages, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'POST': {
      const data = await handler(createNewMessage, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function createNewMessage(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.post(`${updatedServerUrl(req)}/sms`, requestBody, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

async function fetchMessages(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/sms`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
