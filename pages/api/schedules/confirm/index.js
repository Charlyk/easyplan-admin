import axios from "axios";
import { handler } from "../../handler";
import getSubdomain from "../../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../../app/utils/constants";

export const config = { api: { bodyParser: false } };

export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(confirmSchedule, req, res);
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
};

async function confirmSchedule(req) {
  return axios.post(`${updatedServerUrl(req)}/confirmation/schedule`, req.body, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
