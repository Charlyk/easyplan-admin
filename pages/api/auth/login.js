import axios from 'axios';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import { baseApiUrl } from 'eas.config';
import handler from '../handler';

function authenticateWithBackend(req) {
  return axios.post(`${baseApiUrl}/authentication/v1/login`, req.body, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

export default async function login(req, res) {
  const data = await handler(authenticateWithBackend, req, res);
  if (data) {
    res.status(200).json(data);
  }
}
