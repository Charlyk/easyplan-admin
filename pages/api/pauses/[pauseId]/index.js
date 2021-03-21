import axios from "axios";
import { baseApiUrl } from "../../../../eas.config";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";

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
  return axios.delete(`${baseApiUrl}/pauses/${pauseId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
