import axios from "axios";
import cookie from "cookie";
import updatedServerUrl from "../../../../utils/updateServerUrl";
import getSubdomain from '../../../../utils/getSubdomain';
import { HeaderKeys } from "../../../../app/utils/constants";
import { authorized } from "../../authorized";
import { handler } from "../../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT':
      const data = await handler(saveFacebookToken, req, res);
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

function saveFacebookToken(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.put(`${updatedServerUrl(req)}/users/integrations/facebook`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
