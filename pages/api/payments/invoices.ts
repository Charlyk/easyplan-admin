import axios, { AxiosResponse, AxiosError } from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import {
  PaymentInvoices,
  PaymentSubscription,
  ServerResponse,
} from 'types/api';
import authorized from '../authorized';

async function fetchInvoices(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<PaymentInvoices>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  return axios.get(`${updatedServerUrl()}/payments/invoices`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}

async function retryPayment(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<PaymentSubscription>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  return axios.put(
    `${updatedServerUrl()}/payments/retry`,
    {},
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
        const response = await fetchInvoices(req);
        res.json(response.data.data);
        break;
      }
      case 'PUT': {
        const response = await retryPayment(req);
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
