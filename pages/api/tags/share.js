import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";
import { authorized } from "../authorized";
import { handler } from "../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(shareTags, req, res);
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

async function shareTags(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { clinicId } = req.query;
  return axios.post(`${updatedServerUrl(req)}/tags/share/${clinicId}`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
