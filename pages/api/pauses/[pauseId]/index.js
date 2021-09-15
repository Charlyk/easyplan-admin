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
      const data = await handler(deletePauseRecord, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function deletePauseRecord(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { pauseId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/pauses/${pauseId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
