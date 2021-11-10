import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import getSubdomain from "../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";


export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET':
      const data = await handler(fetchUsers, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    default: {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});

function fetchUsers(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${updatedServerUrl(req)}/users`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
