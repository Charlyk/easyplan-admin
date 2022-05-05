import axios, { AxiosResponse, AxiosError } from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { PaymentSubscription, ServerResponse } from 'types/api';
import authorized from '../authorized';

async function changeBillingPeriod(
  req: NextApiRequest,
): Promise<AxiosResponse<ServerResponse<PaymentSubscription>>> {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );

  return axios.put(`${updatedServerUrl()}/payments/billing-period`, req.body, {
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
      case 'PUT': {
        const response = await changeBillingPeriod(req);
        console.log(response.data);
        res.json(response.data.data);
        break;
      }
      default: {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(axiosError.response.data);
    res
      .status(axiosError.response?.status ?? 400)
      .json(axiosError.response?.data);
  }
});
