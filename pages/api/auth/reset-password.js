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
    case 'PUT': {
      try {
        await handler(updateUserPassword, req, res);
        res.json({ message: 'success' });
      } catch (error) {
        return null;
      }
      break;
    }
    default: {
      res.setHeader('Allow', ['POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
}

async function updateUserPassword(req) {
  return axios.put(`${baseApiUrl}/authentication/v1/reset-password`, req.body, {
    headers: {
      'X-EasyPlan-Clinic-Id': -1,
    }
  });
}

function resetUserPassword(req) {
  return axios.post(`${baseApiUrl}/authentication/v1/reset-password`, req.body, {
    headers: {
      'X-EasyPlan-Clinic-Id': -1,
    }
  });
}