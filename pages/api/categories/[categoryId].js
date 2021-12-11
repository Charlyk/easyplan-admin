import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

function updateCategory(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const requestBody = req.body;
  const { categoryId } = req.query;
  return axios.put(
    `${updatedServerUrl(req)}/categories/${categoryId}`,
    requestBody,
    {
      headers: {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinicId,
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}

function deleteCategory(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const { categoryId } = req.query;

  return axios.delete(`${updatedServerUrl()}/categories/${categoryId}`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
    },
  });
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const response = await handler(updateCategory, req, res);
      if (response == null) {
        return;
      }
      res.json(response);
      break;
    }
    case 'DELETE': {
      const response = await handler(deleteCategory, req, res);
      if (response === null) return;
      res.json(response);
      break;
    }
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});
