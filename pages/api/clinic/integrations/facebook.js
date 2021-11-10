import axios from "axios";
import cookie from "cookie";
import updatedServerUrl from "../../../../app/utils/updateServerUrl";
import getSubdomain from '../../../../app/utils/getSubdomain';
import { HeaderKeys } from "../../../../app/utils/constants";
import { authorized } from "../../authorized";
import { handler } from "../../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT':
      const data = await handler(saveFacebookPage, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    default: {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});

function saveFacebookPage(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.put(`${updatedServerUrl(req)}/clinics/integrations/facebook`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    }
  });
}
