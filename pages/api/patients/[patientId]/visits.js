import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import getSubdomain from "../../../../utils/getSubdomain";
import updatedServerUrl from "../../../../utils/updateServerUrl";
import { HeaderKeys } from "../../../../app/utils/constants";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchPatientVisits, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(updateVisit, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function updateVisit(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { patientId, visitId } = req.query;
  return axios.put(`${updatedServerUrl(req)}/patients/${patientId}/edit-visit/${visitId}`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

function fetchPatientVisits(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { patientId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/patients/${patientId}/visits`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
