import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { getSubdomain, updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchInvoiceDetails, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(registerPayment, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function fetchInvoiceDetails(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { invoiceId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/invoices/${invoiceId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
      'X-EasyPlan-Subdomain': getSubdomain(req),
    }
  });
}

function registerPayment(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { invoiceId } = req.query;
  const requestBody = req.body
  return axios.put(`${updatedServerUrl(req)}/invoices/${invoiceId}`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
      'X-EasyPlan-Subdomain': getSubdomain(req),
    }
  });
}
