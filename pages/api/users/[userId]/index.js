import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchUserDetails, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'PUT': {
      const data = await handler(updateUser, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'DELETE': {
      const data = await handler(deleteUser, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
});

async function deleteUser(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { userId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/users/${userId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

async function updateUser(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { userId } = req.query;
  const requestBody = req.body
  return axios.put(`${updatedServerUrl(req)}/users/${userId}`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}

async function fetchUserDetails(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { userId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/users/details/${userId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
