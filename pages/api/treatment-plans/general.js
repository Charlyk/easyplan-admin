import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import { getSubdomain, updatedServerUrl } from "../../../utils/helperFuncs";
import { HeaderKeys } from "../../../app/utils/constants";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(saveGeneralTreatmentPlan, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(updateGeneralTreatmentPlan, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function saveGeneralTreatmentPlan(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.post(
    `${updatedServerUrl(req)}/treatment-plans/general`,
    req.body,
    {
      headers: {
        [HeaderKeys.authorization]: auth_token,
        [HeaderKeys.clinicId]: clinic_id,
        [HeaderKeys.subdomain]: getSubdomain(req),
      }
    }
  );
}

function updateGeneralTreatmentPlan(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.put(
    `${updatedServerUrl(req)}/treatment-plans/general`,
    req.body,
    {
      headers: {
        [HeaderKeys.authorization]: auth_token,
        [HeaderKeys.clinicId]: clinic_id,
        [HeaderKeys.subdomain]: getSubdomain(req),
      }
    }
  );
}
