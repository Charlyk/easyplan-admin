import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import getSubdomain from "../../../utils/getSubdomain";
import updatedServerUrl from "../../../utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(createPauseRecord, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function createPauseRecord(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.post(`${updatedServerUrl(req)}/pauses`, requestBody, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
