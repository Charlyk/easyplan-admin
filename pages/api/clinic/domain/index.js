import axios from "axios";
import { baseApiUrl } from "../../../../eas.config";
import { handler } from "../../handler";

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(checkDomainExists, req, res);
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
};

function checkDomainExists(req) {
  const query = new URLSearchParams(req.query).toString();
  return axios.get(`${baseApiUrl}/clinics/domain-check?${query}`);
}
