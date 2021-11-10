import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../../app/utils/constants";
import { handler } from "../../handler";
import { authorized } from "../../authorized";

export const config = { api: { bodyParser: false } };

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchPatientHistory, req, res);
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

function fetchPatientHistory(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { patientId, page, itemsPerPage } = req.query;
  const queryString = new URLSearchParams({ page, itemsPerPage }).toString()
  return axios.get(`${updatedServerUrl(req)}/history/patient/${patientId}?${queryString}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
