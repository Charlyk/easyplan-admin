import axios, { AxiosError } from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import authorized from '../authorized';

async function fetchAppointmentEndHour(req: NextApiRequest) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const queryString = new URLSearchParams(
    req.query as unknown as string,
  ).toString();

  return axios.get(
    `${updatedServerUrl()}/new-appointment/end-time?${queryString}`,
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

export default authorized(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET': {
        const response = await fetchAppointmentEndHour(req);
        res.json(response.data.data);
        break;
      }
      default: {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    res
      .status(axiosError.response?.status ?? 400)
      .json(axiosError.response?.data);
  }
});
