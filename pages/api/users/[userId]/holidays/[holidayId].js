import axios from "axios";
import { baseApiUrl } from "../../../../../eas.config";
import { authorized } from "../../../authorized";
import cookie from 'cookie';
import { handler } from "../../../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'DELETE':
      const data = await handler(deleteHoliday, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    default: {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});

function deleteHoliday(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { userId, holidayId } = req.query;
  return axios.delete(`${baseApiUrl}/users/${userId}/holidays/${holidayId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
