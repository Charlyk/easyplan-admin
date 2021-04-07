import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'DELETE':
      const data = await handler(deleteInvitation, req, res);
      if (data != null) {
        res.json(data);
      }
      break
    default: {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});

function deleteInvitation(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { invitationId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/clinics/invitations/delete?invitationId=${invitationId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
