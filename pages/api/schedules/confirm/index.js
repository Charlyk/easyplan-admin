import axios from "axios";
import { handler } from "../../handler";
import { updatedServerUrl } from "../../../../utils/helperFuncs";

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchScheduleInfo, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
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
  return axios.post(`${updatedServerUrl(req)}/confirmation/schedule`, req.body);
}

function fetchScheduleInfo(req) {
  const { scheduleId, patientId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/confirmation/schedule/${scheduleId}/${patientId}`);
}
