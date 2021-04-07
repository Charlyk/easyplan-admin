import axios from "axios";
import { baseApiUrl } from "../../../../eas.config";
import { handler } from "../../handler";

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchAvailableTimeZones, req, res);
      if (data != null) {
        res.json(data);
      }
      break
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
};

function fetchAvailableTimeZones(req) {
  return axios.get(`${baseApiUrl}/clinics/available-timezones`);
}
