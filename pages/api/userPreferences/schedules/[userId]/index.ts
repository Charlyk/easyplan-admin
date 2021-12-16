import axios, { AxiosResponse } from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { UserClinic } from 'types';
import authorized from '../../../authorized';
import handler from '../../../handler';

function toggleDoctorCreateShcedulesPermission(
  req,
): Promise<AxiosResponse<UserClinic>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { userId } = req.query;

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  return axios.put(
    `${updatedServerUrl()}/user-preferences/schedules/${userId}`,
    req.body,
    { headers },
  );
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const response: typeof toggleDoctorCreateShcedulesPermission =
        await handler(toggleDoctorCreateShcedulesPermission, req, res);
      if (response !== null) {
        res.json(response);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});
