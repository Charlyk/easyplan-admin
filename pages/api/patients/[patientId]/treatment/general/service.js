import axios from "axios";
import { authorized } from "../../../../authorized";
import cookie from 'cookie';
import { handler } from "../../../../handler";
import { getSubdomain, updatedServerUrl } from "../../../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'DELETE': {
      const data = await handler(deleteGeneralService, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function deleteGeneralService(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { patientId, serviceId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/treatment-plans/general/${patientId}/delete/${serviceId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
      'X-EasyPlan-Subdomain': getSubdomain(req),
    }
  });
}
