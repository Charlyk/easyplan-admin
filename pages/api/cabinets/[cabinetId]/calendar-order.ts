import axios, { AxiosResponse } from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { ClinicUser } from 'types';
import authorized from '../../authorized';
import handler from '../../handler';

function changeCabinetCalendarOrder(req): Promise<AxiosResponse<ClinicUser>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const { cabinetId, orderId } = req.query;

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  return axios.put(
    `${updatedServerUrl()}/cabinets/${cabinetId}/calendar-order?orderId=${orderId}`,
    req.body,
    { headers },
  );
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const response = await handler(changeCabinetCalendarOrder, req, res);
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
