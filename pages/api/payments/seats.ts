import axios, { AxiosResponse, AxiosError } from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { PaymentMethod, ServerResponse } from 'types/api';
import authorized from '../authorized';

async function purchaseSeats(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<any>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const body = {
    seats: req.body.seats,
    interval: req.body.interval,
  };

  return axios.post(`${updatedServerUrl()}/payments/purchase-seats`, body, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

async function removeSeats(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<PaymentMethod[]>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  return axios.put(`${updatedServerUrl()}/payments/remove-seats`, req.body, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
    },
  });
}

export default authorized(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'POST': {
        const response = await purchaseSeats(req);
        res.json(response.data.data);
        break;
      }
      case 'PUT': {
        const response = await removeSeats(req);
        res.json(response.data.data);
        break;
      }
      default: {
        res.setHeader('Allow', ['POST', 'PUT']);
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
