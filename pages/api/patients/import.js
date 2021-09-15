import axios from "axios";
import cookie from 'cookie';
import { IncomingForm } from "formidable";

import { handler } from "../handler";
import { authorized } from "../authorized";
import getSubdomain from "../../../utils/getSubdomain";
import updatedServerUrl from "../../../utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(importPatients, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
});

async function importPatients(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
  return axios.post(`${updatedServerUrl(req)}/patients/import`, req.body, {
    headers: {
      ...req.headers,
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
