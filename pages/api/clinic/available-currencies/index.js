import axios from "axios";
import { baseApiUrl } from "../../../../eas.config";
import { handler } from "../../handler";

export default async function clinicDetails(req, res) {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchAvailableCurrencies, req, res);
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

async function fetchAvailableCurrencies() {
  return axios.get(`${baseApiUrl}/clinics/available-currencies`);
}
