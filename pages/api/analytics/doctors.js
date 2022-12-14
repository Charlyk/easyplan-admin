import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';
import handler from '../handler';

const fetchDoctorsStatistics = async (req) => {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const queryString = new URLSearchParams(req.query);
  const url = `${updatedServerUrl(req)}/app/doctors?${queryString}`;
  return axios.get(url, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
};

export default authorized(async (req, res) => {
  const data = await handler(fetchDoctorsStatistics, req, res);
  if (!data) {
    return;
  }

  res.json(data);
});
