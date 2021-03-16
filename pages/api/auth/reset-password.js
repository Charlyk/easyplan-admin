import { handler } from "../handler";
import axios from "axios";
import { baseApiUrl } from "../../../eas.config";

export default async function resetPassword(req, res) {
  switch (req.method) {
    case 'POST': {
      const data = await handler(resetUserPassword, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }

    default: {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
}

function resetUserPassword(req) {
  const requestBody = req.body;
  return axios.post(`${baseApiUrl}/authentication/v1/reset-password`, requestBody, {
    headers: {
      'X-EasyPlan-Clinic-Id': -1,
    }
  });
}
