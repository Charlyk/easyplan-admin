import axios, { AxiosResponse } from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { CurrentUser } from 'types';
import authorized from '../authorized';
import handler from '../handler';

function changeDoctorCalendarOrder(req): Promise<AxiosResponse<CurrentUser>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  const queryString = new URLSearchParams(req.query);

  return axios.put(
    `${updatedServerUrl()}/user-preferences/calendar-order?${queryString}`,
    req.body,
    { headers },
  );
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const response = await handler(changeDoctorCalendarOrder, req, res);
      if (response) {
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
