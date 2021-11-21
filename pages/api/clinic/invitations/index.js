import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { authorized } from '../../authorized';
import { handler } from '../../handler';

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'DELETE':
      const data = await handler(deleteInvitation, req, res);
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

function deleteInvitation(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { invitationId } = req.query;
  return axios.delete(
    `${updatedServerUrl(
      req,
    )}/clinics/invitations/delete?invitationId=${invitationId}`,
    {
      headers: {
        [HeaderKeys.authorization]: auth_token,
        [HeaderKeys.clinicId]: clinic_id,
        [HeaderKeys.subdomain]: getSubdomain(req),
      },
    },
  );
}
