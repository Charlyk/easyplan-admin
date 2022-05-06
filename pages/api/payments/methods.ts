import axios, { AxiosResponse, AxiosError } from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { PaymentMethod, ServerResponse } from 'types/api';
import authorized from '../authorized';

async function fetchPaymentMethods(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<PaymentMethod[]>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  return axios.get(`${updatedServerUrl()}/payments/payment-methods`, {
    headers: {
      [HeaderKeys.authorization]: authToken,
      [HeaderKeys.clinicId]: clinicId,
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    },
  });
}

async function addPaymentMethod(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<any>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  return axios.post(
    `${updatedServerUrl()}/payments/payment-methods`,
    req.body,
    {
      headers: {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinicId,
        [HeaderKeys.subdomain]: getSubdomain(req),
      },
    },
  );
}

async function deletePaymentMethod(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<PaymentMethod[]>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  return axios.delete(
    `${updatedServerUrl()}/payments/payment-methods?id=${req?.query?.id}`,
    {
      headers: {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinicId,
        [HeaderKeys.subdomain]: getSubdomain(req),
      },
    },
  );
}

async function setPaymentMethodAsDefault(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<PaymentMethod[]>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  const body = {
    methodId: req.body?.id,
  };

  return axios.put(
    `${updatedServerUrl()}/payments/payment-methods/default`,
    body,
    {
      headers: {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinicId,
        [HeaderKeys.subdomain]: getSubdomain(req),
      },
    },
  );
}

export default authorized(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET': {
        const response = await fetchPaymentMethods(req);
        res.json(response.data.data);
        break;
      }
      case 'POST': {
        const response = await addPaymentMethod(req);
        res.json(response.data.data);
        break;
      }
      case 'DELETE': {
        const response = await deletePaymentMethod(req);
        res.json(response.data.data);
        break;
      }
      case 'PUT': {
        const response = await setPaymentMethodAsDefault(req);
        res.json(response.data.data);
        break;
      }
      default: {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
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
