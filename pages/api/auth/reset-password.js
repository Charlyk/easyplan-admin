import { handler } from "../handler";
import axios from "axios";
import getSubdomain from "../../../utils/getSubdomain";
import updatedServerUrl from "../../../utils/updateServerUrl";
import { HeaderKeys } from "../../../app/utils/constants";

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
  return axios.put(`${updatedServerUrl(req)}/authentication/v1/reset-password`, req.body, {
    headers: {
      [HeaderKeys.clinicId]: -1,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

function resetUserPassword(req) {
  return axios.post(`${updatedServerUrl(req)}/authentication/v1/reset-password`, req.body, {
    headers: {
      [HeaderKeys.clinicId]: -1,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
