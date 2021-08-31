import axios from "axios";
import { handler } from "../../handler";
import { getSubdomain, updatedServerUrl } from "../../../../utils/helperFuncs";
import { HeaderKeys } from "../../../../app/utils/constants";

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

async function fetchAvailableCurrencies(req) {
  return axios.get(`${updatedServerUrl(req)}/clinics/available-currencies`, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
