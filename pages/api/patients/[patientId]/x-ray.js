import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../../app/utils/updateServerUrl";
import { authorized } from "../../authorized";
import { handler } from "../../handler";
import { HeaderKeys } from "../../../../app/utils/constants";


export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchPatientXRayImages, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'POST': {
      const data = await handler(addXRayImage, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'DELETE': {
      const data = await handler(deleteXRayImage, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function fetchPatientXRayImages(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { patientId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/patients/${patientId}/x-ray`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

function addXRayImage(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { patientId } = req.query;
  return axios.post(`${updatedServerUrl(req)}/patients/${patientId}/x-ray`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    }
  });
}

function deleteXRayImage(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { patientId, imageId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/patients/${patientId}/x-ray/${imageId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
