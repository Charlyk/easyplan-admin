import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../../../authorized';
import handler from '../../../handler';

//info for wether to create or delete the doctor is included in req.body;

async function manipulateDoctorInfo(req, _) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const { cabinetId } = req.query;

  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
    [HeaderKeys.subdomain]: getSubdomain(req),
  };

  return axios.put(
    `${updatedServerUrl()}/cabinets/${cabinetId}/doctors`,
    req.body,
    {
      headers,
    },
  );
}

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT':
      {
        const data = await handler(manipulateDoctorInfo, req, res);
        if (data !== false) {
          res.json(data);
        }
      }
      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
