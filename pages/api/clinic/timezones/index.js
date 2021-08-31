import axios from "axios";
import { handler } from "../../handler";
import { getSubdomain, updatedServerUrl } from "../../../../utils/helperFuncs";
import { HeaderKeys } from "../../../../app/utils/constants";

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
  return axios.get(`${updatedServerUrl(req)}/clinics/available-timezones`, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
