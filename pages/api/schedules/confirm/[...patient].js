import axios from "axios";
import { handler } from "../../handler";
import { getSubdomain, updatedServerUrl } from "../../../../utils/helperFuncs";
import { HeaderKeys } from "../../../../app/utils/constants";

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchScheduleInfo, req, res);
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

function fetchScheduleInfo(req) {
  const { patient } = req.query;
  const [scheduleId, patientId] = patient;
  return axios.get(`${updatedServerUrl(req)}/confirmation/schedule/${scheduleId}/${patientId}`, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
