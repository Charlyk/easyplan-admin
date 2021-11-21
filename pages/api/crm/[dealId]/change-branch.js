import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { authorized } from '../../authorized';
import { handler } from '../../handler';

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(moveDealToAnotherBranch, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function moveDealToAnotherBranch(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId, branchId } = req.query;
  return axios.put(
    `${updatedServerUrl(req)}/crm/deals/${dealId}/move-to?branchId=${branchId}`,
    { branchId },
    {
      headers: {
        [HeaderKeys.authorization]: auth_token,
        [HeaderKeys.clinicId]: clinic_id,
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}
