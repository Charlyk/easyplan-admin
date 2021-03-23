import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(saveGeneralTreatmentPlan, req, res);
      if (data != null) {
        res.json(data);
      } else {
        res.json(null);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function saveGeneralTreatmentPlan(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.post(
    `${baseApiUrl}/treatment-plans/general`,
    req.body,
    {
      headers: {
        Authorization: auth_token,
        'X-EasyPlan-Clinic-Id': clinic_id,
      }
    }
  );
}
